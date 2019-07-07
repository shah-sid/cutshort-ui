import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Widget } from 'app/models/widget';

@Component({
  selector: 'widgets-catalog',
  templateUrl: './widgets-catalog.component.html',
  styleUrls: ['./widgets-catalog.component.scss']
})
export class WidgetsCatalogComponent implements OnInit, OnChanges {
  @Input('widget-catalog') masterWidgets: Widget[];
  @Input('card-title') title: string;

  @Output('onWidgetSelect') selectWidget = new EventEmitter();

  showMasterWidgetsLoader = true;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    console.log('MasterWidget Changes', changes.masterWidgets.currentValue);
    if (changes.masterWidgets && changes.masterWidgets.currentValue != null) {
      this.showMasterWidgetsLoader = false;
    }
  }

  ngOnInit() {
  }

  widgetClicked(widget: Widget) {
    console.log('View widget', widget);
    this.selectWidget.emit({ widget: widget });
  }
}
