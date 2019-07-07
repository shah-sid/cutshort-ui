import { Component, OnInit } from "@angular/core";
import { Subscription, EMPTY } from "rxjs";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { WidgetsService } from "app/services/widgets.service";
import { NgxSpinnerService } from "ngx-spinner";
import { switchMap } from "rxjs/operators";
import * as _ from "lodash";

const WIDGET_TYPE = "columnChart";

const HIGHCHARTS_DEFAULT_COLORS = [
  "#7cb5ec",
  "#434348",
  "#90ed7d",
  "#f7a35c",
  "#8085e9",
  "#f15c80",
  "#e4d354",
  "#2b908f",
  "#f45b5b",
  "#91e8e1"
];

@Component({
  selector: "column-chart-config",
  templateUrl: "./column-chart-config.component.html",
  styleUrls: ["./column-chart-config.component.scss"]
})
export class ColumnChartConfigComponent implements OnInit {
  action: string;
  dashID: string;
  widgetID: string;
  widgetConfigOptions: any;
  previewConfigOptions: any;
  initSubscription: Subscription;
  sensorOptions = [];
  seriesColor = _.cloneDeep(HIGHCHARTS_DEFAULT_COLORS[0]);
  linearStepper = true;
  _ = _;
  sources: {
    source: string;
    color: string;
    dataDuration: number;
  }[] = [];

  selectedStepperTab = 0;

  sourceData = ['Cutshort','Linkedin','Angellist','Indeed'];

  chartConfigForm = new FormGroup({
    source: new FormControl(this.sourceData[0], [Validators.required]),
    widgetSize: new FormControl("S", [Validators.required]),
    dataDuration: new FormControl(1, [Validators.required])
  });

  dataDurationOptions = [
    {
      viewValue: "Hourly Data",
      value: 1 // No. of Days
    },
    {
      viewValue: "Daily Data",
      value: 8 // No. of Days
    }
  ];

  widgetSizeOptions = [
    {
      value: "S",
      viewValue: "Small"
    },
    {
      value: "M",
      viewValue: "Medium"
    },
    {
      value: "L",
      viewValue: "Large"
    }
  ];

  dashStyleOptions = [
    {
      value: "solid",
      viewValue: "Solid"
    },
    {
      value: "shortdash",
      viewValue: "Short Dash"
    },
    {
      value: "shortdot",
      viewValue: "Short Dot"
    },
    {
      value: "shortdashdot",
      viewValue: "Short Dash Dot"
    },
    {
      value: "shortdashdotdot",
      viewValue: "Short Dash Dot Dot"
    },
    {
      value: "dot",
      viewValue: "Dot"
    },
    {
      value: "dash",
      viewValue: "Dash"
    },
    {
      value: "longdash",
      viewValue: "Long Dash"
    },
    {
      value: "dashdot",
      viewValue: "Dash Dot"
    },
    {
      value: "longdashdot",
      viewValue: "Long Dash Dot"
    },
    {
      value: "longdashdotdot",
      viewValue: "Long Dash Dot Dot"
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private widgetsService: WidgetsService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initSubscription = this.route.queryParams
      .pipe(
        switchMap((params: any) => {
          console.log("Widget params", params);
          this.action = params.action;
          this.dashID = params.d;
          if (this.action == "edit") {
            this.widgetID = params.w;
            return this.widgetsService.getWidgetConfig(this.widgetID);
          }
          return EMPTY;
        })
      )
      .subscribe((widgetConfig: any) => {
        if (widgetConfig) {
          this.widgetConfigOptions = widgetConfig || {};
          if (this.action == "edit") {
            this.initChartConfigForm();
          }
        } else {
			this.chartConfigForm
			.get("source")
			.patchValue(this.sourceData[0]);
		 
          this.widgetConfigOptions = {};
        }
      });

    this.chartConfigForm.valueChanges.subscribe(() => {
      // Update preview config evrytime widgetConfigForm changes
    //   this.initPreviewConfig();
    });
  }

  initChartConfigForm() {
    this.chartConfigForm
      .get("source")
      .patchValue(this.widgetConfigOptions.sources[0].source);
     this.sources = this.widgetConfigOptions.sources;
    this.chartConfigForm
      .get("widgetSize")
	  .patchValue(this.widgetConfigOptions.widgetSize || "S");
	  this.initPreviewConfig()
   }

  initPreviewConfig() {
      this.previewConfigOptions = {
        sources: this.sources,
        widgetSize: this.chartConfigForm.value.widgetSize,
        isPreview: true
      };
    
  }

  addSource() {
    if (
      _.find(
        this.sources,
        (item: any) =>
          item.source == this.chartConfigForm.value.source
	  ) == undefined ||
	  _.find(
        this.sources,
        (item: any) =>
          item.dataDuration == this.chartConfigForm.value.dataDuration
      ) == undefined
  
    ) {
      this.sources.push({
        source: this.chartConfigForm.value.source,
        color: this.seriesColor,
        dataDuration: +this.chartConfigForm.value.dataDuration || 1
      });

      console.log("Sources Added", this.sources);
      this.seriesColor = _.cloneDeep(
        HIGHCHARTS_DEFAULT_COLORS[
          this.sources.length % HIGHCHARTS_DEFAULT_COLORS.length
        ]
      );
      this.initPreviewConfig();
    }
  }

  removeSource(index: number) {
    if (this.sources.length > 1) {
      this.sources.splice(index, 1);
      this.initPreviewConfig();
    }
  }


  updateWidgetSize(size: string) {
    this.chartConfigForm.get('widgetSize').patchValue(size);
  }

  buildConfig(configData: any, doSubmit: boolean) {
    if (this.action == "add") {
      this.widgetConfigOptions = {
        sources: this.sources,
        widgetType: WIDGET_TYPE,
        widgetSize: configData.widgetSize,
        position: {
          x: 100,
          y: 0
        }
      };
    } else if (this.action == "edit") {
      this.widgetConfigOptions.sources = this.sources;
      this.widgetConfigOptions.widgetSize = configData.widgetSize;
    }

    console.log("Adding widget", this.widgetConfigOptions);

    if (doSubmit) {
      this.submitConfig();
    }
  }

  submitConfig() {
    this.spinner.show();
    if (this.action == "add") {
      this.widgetsService
        .addWidgetToDashboard(
          this.dashID,
          WIDGET_TYPE,
          this.widgetConfigOptions
        )
        .subscribe(
          (res: boolean) => {
            this.spinner.hide();
            if (res) {
              this.router.navigate(["/custom-dashboards/view"], {
                queryParams: { id: this.dashID }
              });
            }
          },
          () => {
            this.spinner.hide();
          }
        );
    }

    if (this.action == "edit") {
      this.widgetsService
        .updateWidgetConfig(
          this.widgetID,
          WIDGET_TYPE,
          this.widgetConfigOptions
        )
        .subscribe(
          (res: boolean) => {
            this.spinner.hide();
            if (res) {
              this.router.navigate(["/custom-dashboards/view"], {
                queryParams: { id: this.dashID }
              });
            }
          },
          () => {
            this.spinner.hide();
          }
        );
    }
  }

  cancelUpdate() {
    this.router.navigate([`/custom-dashboards/view`], {
      queryParams: { id: this.dashID }
    });
  }

  isMobileDisplay() {
    return window.screen.width <= 576;
  }
}
