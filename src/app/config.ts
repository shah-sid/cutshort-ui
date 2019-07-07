import {IMqttServiceOptions} from 'ngx-mqtt';
import { environment } from 'environments/environment';

export const APP_SERVER_OPTIONS = {
    host: environment.HOST,
    port: environment.PORT
};

export const BOSCH_SERVER_OPTIONS = {
  host: environment.BOSCH_API_HOST
};

export const REPORT_GEN_SERVER_OPTIONS = {
  host: environment.REPORT_GEN_HOST
}

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  connectOnCreate: false,
  reconnectPeriod: 0,
  hostname: 'hap.faclon.com',
  port: 8084,
  path: '/mqtt',
  protocol: 'wss',
};

export const MQTT_LEGACY_DEVICEDATA_TOPIC = 'devicesIn/+/dataTest';
export const MQTT_DEVICEDATA_TOPIC = 'devicesIn/+/data';
export const MQTT_ECUDATA_TOPIC = 'sixth/+/data'

export const APP_VER = "1.0.1";
