export interface PlotBand {
  sensor: { sensorId: string; sensorName: string };
  from: number;
  to: number;
  label?: any;
  labelText?: string;
  color: string;
  series?: any;
};
