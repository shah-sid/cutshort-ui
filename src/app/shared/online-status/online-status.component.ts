import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { WindowRef } from '../../services/window-ref.service';

@Component({
  selector: 'online-status',
  templateUrl: './online-status.component.html',
  styleUrls: ['./online-status.component.scss']
})
export class OnlineStatusComponent implements OnInit {
  connectionInterval;

  constructor(private winRef: WindowRef) { }
  ngOnInit() {
    clearInterval(this.connectionInterval)
    this.connectionInterval = this.watchConnection();
  }

  watchConnection() {
    const self = this;
    return setInterval(function() {
      console.log('Online ?', self.winRef.nativeWindow.navigator.onLine);
    }, 1000);
  }

}
