import { Type } from '@angular/core';

export class WidgetItem {
  constructor(public _id: string, public component: Type<any>, public config: any, public dashboardId: string) {}
}
