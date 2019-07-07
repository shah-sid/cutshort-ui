import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'widget-options-menu',
  templateUrl: './widget-options-menu.component.html',
  styleUrls: ['./widget-options-menu.component.scss']
})
export class WidgetOptionsMenuComponent implements OnInit {
  @Input('menuItems') menuItems: { value: string, viewValue: string, icon: string, color: string }[];
  @Output('onMenuItemClicked') onMenuItemClicked = new EventEmitter();
  menuItemColor = "primary";

  constructor() { }

  ngOnInit() {
  }

  menuItemClicked($event, menuItem) {
    console.log('Menu item clicked', $event, menuItem);
    this.onMenuItemClicked.emit({$event: $event, itemClicked: menuItem});
  }

}
