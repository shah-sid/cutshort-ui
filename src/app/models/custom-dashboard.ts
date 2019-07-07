import { Widget } from './widget';

export interface CustomDashboard {
    _id?: string;
    dashboardID?: string;
    description?: string;
    tags?: string[];
    type?: string;
    widgets?: Widget[];
}