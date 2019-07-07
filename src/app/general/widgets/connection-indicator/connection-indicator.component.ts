import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'connection-indicator',
  templateUrl: './connection-indicator.component.html',
  styleUrls: ['./connection-indicator.component.scss']
})
export class ConnectionIndicatorComponent implements OnInit {
  @Input('connectionStatus') connectionStatus;

  constructor() { }

  ngOnInit() {
  }

}
