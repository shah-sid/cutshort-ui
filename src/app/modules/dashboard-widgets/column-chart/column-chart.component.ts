import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	ViewChild,
	SimpleChanges,
	OnChanges,
	OnDestroy
} from "@angular/core";
import { Subscription } from "rxjs";
import { WidgetsService } from "app/services/widgets.service";
import * as moment from "moment";
import * as _ from "lodash";
import * as Highcharts from "highcharts";

declare let alasql;
declare let require: any;
require("../../../../assets/js/core/no-data-to-display")(Highcharts);

@Component({
	selector: "column-chart",
	templateUrl: "./column-chart.component.html",
	styleUrls: ["./column-chart.component.scss"]
})
export class ColumnChartComponent implements OnInit, OnChanges, OnDestroy {
	@Input("config") config: any;
	@Input("widgetId") widgetId: string;
	@Input("dashboardId") dashboardId: string;

	@Output("manageConfig") manageConfig = new EventEmitter();
	@Output("deleteWidget") deleteWidget = new EventEmitter();

	sources: {
		source: string;
		color: string;
		dataDuration: number;
		tabText?: string;
	}[] = [];

	widgetSize: string;
	dragPosition: { x: number; y: number };
	isPreview: boolean;
	editLayoutState = false;
	Highcharts = Highcharts; // required
	chartOptions: Object;
	chartData = [];
	seriesData = [];
	showChartLoader = true;
	dataToExport = [];

	selectedChart = 0;

	@ViewChild("datePicker") datePicker;

	subscription: Subscription;

	sensorParams = [];

	dragAxis = {
		x: true,
		y: true
	};

	widgetMenuOptions = [
		{
			value: "config",
			viewValue: "Config",
			icon: "settings",
			color: "primary"
		},
		{
			value: "delete",
			viewValue: "Delete",
			icon: "delete",
			color: "warn"
		}
	];

	constructor(
		private widgetsService: WidgetsService
	) { }

	ngOnInit() {
		console.log("Config in init", this.config);
		this.initializeWidget();

		this.widgetsService.editLayout$.subscribe((state: boolean) => {
			this.editLayoutState = state;
			if (state && !this.isPreview) {
				this.dragAxis = {
					x: true,
					y: true
				};
			} else {
				this.dragAxis = {
					x: false,
					y: false
				};
			}
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.config && changes.config.currentValue) {
			console.log("Config in onChanges", this.config);
			window.dispatchEvent(new Event("resize"));
			this.showChartLoader = true;
			this.initializeWidget();
			this.datePicker.resetDate();
		}
	}

	ngOnDestroy() {
	}

	initializeWidget() {
		this.isPreview = this.config.isPreview;
		this.sources = this.config.sources;
		this.widgetSize = this.config.widgetSize || "S";
		this.dragPosition = this.config.position || { x: 0, y: 0 };
		this.sources.forEach(item => {
			item["tabText"] =
				item.dataDuration == 1
					? `Hourly ${item.source}`
					: item.dataDuration == 8
						? `Daily ${item.source}`
						: `Monthly ${item.source}`;
		});
		if (!this.isPreview && this.editLayoutState) {
			this.dragAxis = {
				x: true,
				y: true
			};
		} else {
			this.dragAxis = {
				x: false,
				y: false
			};
		}


	}



	handleWidgetAction(eventArgs) {
		console.log("Widget Action", eventArgs);

		switch (eventArgs.itemClicked) {
			case "config":
				this.manageConfig.emit({
					widgetType: this.config.widgetType,
					dashboardId: this.dashboardId,
					widgetConfigId: this.widgetId
				});
				break;

			case "delete":
				this.deleteWidget.emit({
					dashboardId: this.dashboardId,
					widgetConfigId: this.widgetId
				});
				break;
		}
	}


	isMobileDisplay() {
		return window.screen.width <= 576;
	}

	dragEnd($event: any) {
		console.log("Drag ended", $event);
		if (this.config.position) {
			this.config.position.x += $event.y;
			this.config.position.y += $event.x;
		} else {
			this.config["position"] = {
				x: 0,
				y: 0
			};

			this.config.position.x = $event.y;
			this.config.position.y = $event.x;
		}
	}

	setSelectedChart(chart) {
		const resetDatePicker =
			this.sources[this.selectedChart].dataDuration ==
			this.sources[chart].dataDuration;
		this.selectedChart = chart;
		if (
			resetDatePicker &&
			(this.sources[this.selectedChart].dataDuration == 1 ||
				this.sources[this.selectedChart].dataDuration == 8)
		) {
			this.datePicker.resetDate();
		}
		this.showChartLoader = true;
	}

	drawHourlyDataChart() {
		const self = this;
		this.chartOptions = {
			chart: {
				type: "column",
				zoomType: "x"
			},
			title: {
				text: ""
				// align: 'left',
				// x: 60
			},

			xAxis: {
				title: {
					text: "Date"
				},
				type: "category",
				labels: {
					style: {
						fontSize: "13px",
						fontFamily: "Verdana, sans-serif"
					},
					formatter: function () {
						const tool = parseInt(this.value, 0) / 1000 - 19800;
						return (
							moment.unix(tool).format("h") +
							" - " +
							moment
								.unix(tool)
								.add(1, "hours")
								.format("h") +
							" " +
							moment
								.unix(tool)
								.add(1, "hours")
								.format("a")
						);
					}
				}
			},
			yAxis: {
				title: {
					text: self.sources[self.selectedChart].source
				}
			},
			legend: {
				enabled: false
			},
			exporting: {
				enabled: false
			},
			tooltip: {
				formatter: function () {
					const time = parseInt((this.key / 1000 - 19800).toString(), 0);
					return (
						"<b>" +
						self.sources[self.selectedChart].source +
						"</b><br>" +
						moment.unix(time).format("DD/MM/YYYY") +
						"<br>" +
						moment
							.unix(time)
							.startOf("hour")
							.format("hh:mm a") +
						" - " +
						moment
							.unix(time)
							.add(1, "hours")
							.startOf("hour")
							.format("hh:mm a") +
						"<br/>" +
						this.y
					);
				}
			},
			plotOptions: {
				column: {
					stacking: "normal"
				},
				series: {
					events: {
						legendItemClick: function (e) {
							e.preventDefault();
						}
					}
				}
			},
			credits: {
				enabled: false
			},
			series: self.seriesData,

			navigation: {
				buttonOptions: {
					align: "left",
					x: 20
				}
			}
		};
	}

	drawDailyDataChart() {
		const self = this;
		this.chartOptions = {
			chart: {
				type: "column",
				zoomType: "x"
			},
			title: {
				text: ""
				// align: 'left',
				// x: 60
			},

			xAxis: {
				range: 1 * 30 * 24 * 3600 * 1000, // 1 month
				title: {
					text: "Date"
				},
				type: "category",
				labels: {
					style: {
						fontSize: "13px",
						fontFamily: "Verdana, sans-serif"
					},
					formatter: function () {
						return moment(parseInt(this.value, 0)).format("MMM DD");
					}
				}
			},
			yAxis: {
				title: {
					text: self.sources[self.selectedChart].source
				}
			},
			legend: {
				enabled: false
			},
			exporting: {
				enabled: false
			},
			tooltip: {
				formatter: function () {
					console.log("tooltip time", this);
					// tslint:disable-next-line:max-line-length
					return (
						"<b>" +
						self.sources[self.selectedChart].source +
						"</b><br>" +
						moment(parseInt(this.key, 0)).format("DD MM YYYY") +
						"<br/>" +
						this.y +
						" " +
						self.sources[self.selectedChart].source
					);
				}
			},
			plotOptions: {
				column: {
					stacking: "normal"
				},
				series: {
					events: {
						legendItemClick: function (e) {
							e.preventDefault();
						}
					}
				}
			},
			credits: {
				enabled: false
			},
			series: self.seriesData,

			navigation: {
				buttonOptions: {
					align: "left",
					x: 20
				}
			}
		};
	}

	formatHourlyChartData(data) {
		this.seriesData = [];
		const currentSeries = {
			name: "",
			data: data,
			color: null
		};
		let value = 0;
		currentSeries.data = _.reverse(currentSeries.data);
		this.seriesData.push(currentSeries);
		this.showChartLoader = false;
		this.drawHourlyDataChart();
	}

	formatDailyChartData(data) {
		this.seriesData = [];
		const currentSeries = {
			name: "",
			data: data,
			color: null
		};
		let value = 100;
		currentSeries.name = this.sources[this.selectedChart].source;
		currentSeries.color = this.sources[this.selectedChart].color;
		currentSeries.data = _.reverse(currentSeries.data);
		this.seriesData.push(currentSeries);
		this.drawDailyDataChart();
		this.showChartLoader = false;
	}

	getHourlyTotalData(startTime, endTime, source) {
		this.chartData = [];
		this.showChartLoader = true;
		let producerDaysSet = endTime.diff(startTime, "hours");
		const registrations = this.generateRegistrationData(producerDaysSet);
		this.formatHourlyChartData(registrations);
		//   });
	}

	generateRegistrationData(days: number) {
		const registrationData = [];
		for (let i = 0; i < days; i++) {
		  if(i == 0) {
			registrationData.push([
			  moment()
				.subtract(days - i, "hours")
				.valueOf(),
			  (Math.random() * 1000) % 10
			]);
		  } else {
			registrationData.push([
			  moment()
				.subtract(days - i, "hours")
				.valueOf(),
			  registrationData[registrationData.length - 1][1] + (Math.random() * 1000) % 10
			]);
		  }
		}
		return registrationData;
	  }

	getDailyTotalData(startTime, endTime, source) {
		const days = endTime.diff(startTime, "days");
		// this.devicesService
		//   .getWaterLevelDelta(this.device.devID, sensor, endTime, days)
		//   .subscribe(data => {
		// console.log("Daily Total data", data);
		this.chartData = [];
		this.chartData = [];
		this.showChartLoader = true;
		let producerDaysSet = endTime.diff(startTime, "hours");
		const registrations = this.generateRegistrationData(producerDaysSet);
		this.formatDailyChartData(registrations);
		//   });
	}

	onDateSet(eventArgs) {
		console.log("Date Set called", eventArgs);
		this.showChartLoader = true;
		switch (this.sources[this.selectedChart].dataDuration) {
			case 1:
				this.getHourlyTotalData(
					eventArgs.startDateTime,
					eventArgs.endDateTime,
					this.sources[this.selectedChart].source
				);
				break;

			case 8:
				this.getDailyTotalData(
					eventArgs.startDateTime,
					eventArgs.endDateTime,
					this.sources[this.selectedChart].source
				);
				break;
		}
	}

	onDateReset(eventArgs) {
		console.log("Date Set called", eventArgs);
		this.showChartLoader = true;
		switch (this.sources[this.selectedChart].dataDuration) {
			case 1:
				this.getHourlyTotalData(
					eventArgs.startDateTime,
					eventArgs.endDateTime,
					this.sources[this.selectedChart].source
				);
				break;

			case 8:
				this.getDailyTotalData(
					eventArgs.startDateTime,
					eventArgs.endDateTime,
					this.sources[this.selectedChart].source
				);
				break;
		}
	}

}
