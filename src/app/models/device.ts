
export interface Device {
    _id: string;
    devID: string;
    devTypeID: string;
    devTypeName: string;
    devName?: string;
    addedOn?: any;
    unitSelected?: any;

    star?: boolean;
    sensors: any[];
    unit: any;
    params: any;
    properties: any;
    added_by: any;
    organisations: any[];
    notes: any[];
    notifExps: any[];
    users: any[];
    whiteListedUsers: string[];

    location: {
        latitude: number,
        longitude: number
    };
    mobileno: number;
    deployed_by: string;
    deployed_on: any;

    isActive: boolean;
    lastActiveAt?: any;
    timeCreated: any;

    tags: string[];
    search: string[];

    signalIcon?: string;
    topic?: string;
    vehicle?: any;
    geoFences?: any;
}
