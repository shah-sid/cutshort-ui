import { Injectable } from '@angular/core';
import { MqttService, MqttConnectionState } from 'ngx-mqtt';
import { Subscription ,  Observable } from 'rxjs';
import { MQTT_SERVICE_OPTIONS } from '../config';

@Injectable()
export class PubSubService {
  mqttConnectionState$: Observable<MqttConnectionState>;
  retryCount = 0;
  constructor(private _mqttService: MqttService) {
    this.mqttConnectionState$ = this._mqttService.state.asObservable();
  }

  public unsafePublish(topic: string, message: string): void {
    this._mqttService.unsafePublish(topic, message, {qos: 1, retain: true});
  }

  observe(topic) {
    console.log('Observing', topic);
    return this._mqttService.observe(topic)
  }

  unsubscribe(subscription: Subscription) {
    if (subscription) {
      return subscription.unsubscribe();
    }
  }

  connectMQTT() {
    console.log("MQTT state: ", this._mqttService.state);
    const client = JSON.parse(localStorage.getItem('userData'));
    // MQTT_SERVICE_OPTIONS.username = client.email;
    // MQTT_SERVICE_OPTIONS.password = client.password;
    // MQTT_SERVICE_OPTIONS.clientId = client.password;
    MQTT_SERVICE_OPTIONS.username = 'admin';
    MQTT_SERVICE_OPTIONS.password = 'faclontest';
    MQTT_SERVICE_OPTIONS.clientId = client.email + Date.now() % 10000;

    this._mqttService.connect(MQTT_SERVICE_OPTIONS);
  }

  disconnectMQTT() {
    this._mqttService.disconnect();
  }

}
