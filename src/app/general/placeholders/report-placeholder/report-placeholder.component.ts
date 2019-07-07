import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'report-placeholder',
  templateUrl: './report-placeholder.component.html',
  styleUrls: ['./report-placeholder.component.scss']
})
export class ReportPlaceholderComponent implements OnInit {
  @Input('count') count: number;

  cardCount = [];
  constructor() { }

  ngOnInit() {
    this.count = this.count == 0 ? 1 : this.count;
    for (let i = 1; i <= this.count; i ++ ) {
      this.cardCount.push(i);
    }
  }

}
