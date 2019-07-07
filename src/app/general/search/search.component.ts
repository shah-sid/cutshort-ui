import * as _ from 'lodash';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';

import { MatChipInputEvent } from '@angular/material';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Input('placeholder') placeholder: string;
  @Input('multiple') multiple: boolean;
  @Input('hint') hintText: string;
  searchTerms = [];
  textChangeTimeout;
  setSearchTextFocus = false;

  // chip config
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  @Output('onSearchChange') onSearchChange = new EventEmitter();

  @ViewChild('searchChipInput') searchChipInput: ElementRef;
  constructor() { }

  ngOnInit() {
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our term
    if ((value || '').trim()) {
      this.searchTerms.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.onSearchChange.emit({ searchTerms: _.cloneDeep(this.searchTerms) });
  }

  remove(term: any): void {
    const index = this.searchTerms.indexOf(term);

    if (index >= 0) {
      this.searchTerms.splice(index, 1);
    }

    this.onSearchChange.emit({ searchTerms: _.cloneDeep(this.searchTerms) });
  }

  searchTextChanged(searchTerm) {
    this.onSearchChange.emit({ searchTerms: _.cloneDeep(searchTerm.value) });
  }

}
