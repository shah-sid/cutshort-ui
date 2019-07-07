
export interface AuthResp {
    success?: boolean;
    access_token?: string;
    refresh_token?: string;
    user?: any;
    device?: any;
    data?: any;
    lastDataPoint?: any;
    version?: string;
    errorfor: any;
    errors: any[];
  }
