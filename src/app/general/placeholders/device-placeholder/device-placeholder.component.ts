import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'device-placeholder',
  templateUrl: './device-placeholder.component.html',
  styleUrls: ['./device-placeholder.component.scss']
})
export class DevicePlaceholderComponent implements OnInit {
  @Input('count') count: number;
  @Input('view') view: string;

  cardCount = [];
  constructor() { }

  ngOnInit() {
    this.count = this.count == 0 ? 1 : this.count;
    for (let i = 1; i <= this.count; i ++ ) {
      this.cardCount.push(i);
    }
  }

}
