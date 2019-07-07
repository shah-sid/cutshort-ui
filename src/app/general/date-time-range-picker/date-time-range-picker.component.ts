import { Component, EventEmitter, OnInit, ViewChild, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { ToastService } from '../../services/toast.service';
import * as moment from 'moment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'date-time-range-picker',
  templateUrl: './date-time-range-picker.component.html',
  styleUrls: ['./date-time-range-picker.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class DateTimeRangePickerComponent  implements OnInit, OnChanges {
  @Input('showTime') showTime: boolean;
  @Input('duration') duration: number; // in days

  @Output('onDateSet') dateSet = new EventEmitter();
  @Output('onDateReset') dateReset = new EventEmitter();

  hoursToShow = [];
  minsToShow = [];
  startDt = moment().subtract(1, "days")
  startTimeHr = moment().subtract(1, "days").hour();
  startTimeMin = moment().subtract(1, "days").minute();

  endDt = moment();
  endTimeHr = moment().hour();
  endTimeMin = moment().minute();
  startDateMax = this.endDt;
  endDateMax = moment();
  endDateMin = this.startDt;

  dateTimePickerForm = new FormGroup({
    startDate: new FormControl(''),
    startTimeHr: new FormControl('', [Validators.min(0), Validators.max(23)]),
    startTimeMin: new FormControl('', [Validators.min(0), Validators.max(59)]),
    endDate: new FormControl(''),
    endTimeHr: new FormControl('', [Validators.min(0), Validators.max(23)]),
    endTimeMin: new FormControl('', [Validators.min(0), Validators.max(59)]),
  })

  constructor(private toastService: ToastService) { }

  ngOnInit() {
    console.log('Duration', this.duration);
    this.startDt = moment().subtract(this.duration, "days");
    this.dateTimePickerForm.get('startDate').patchValue(this.startDt);
    this.dateTimePickerForm.get('startTimeHr').patchValue(this.startTimeHr);
    this.dateTimePickerForm.get('startTimeMin').patchValue(this.startTimeMin);

    this.dateTimePickerForm.get('endDate').patchValue(this.endDt);
    this.dateTimePickerForm.get('endTimeHr').patchValue(this.endTimeHr);
    this.dateTimePickerForm.get('endTimeMin').patchValue(this.endTimeMin);

    for (let i = 0; i < 24; i++) {
      this.hoursToShow.push(i);
    }

    for (let i = 0; i < 60; i++) {
      this.minsToShow.push(i);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Date Duration', this.duration);
    this.startDt = moment().subtract(this.duration, "days");
    this.dateTimePickerForm.get('startDate').patchValue(this.startDt);
    this.dateTimePickerForm.get('startTimeHr').patchValue(this.startTimeHr);
    this.dateTimePickerForm.get('startTimeMin').patchValue(this.startTimeMin);

    this.dateTimePickerForm.get('endDate').patchValue(this.endDt);
    this.dateTimePickerForm.get('endTimeHr').patchValue(this.endTimeHr);
    this.dateTimePickerForm.get('endTimeMin').patchValue(this.endTimeMin);
    this.setDate();
  }

  isMobileDisplay() {
    return (window.screen.width <= 576)
  }

  setDate() {
    let sDateTime, eDateTime;
    sDateTime = moment(this.dateTimePickerForm.get('startDate').value).format('DD/MM/YYYY') + ' ' +
                      this.dateTimePickerForm.get('startTimeHr').value + ':' +
                      this.dateTimePickerForm.get('startTimeMin').value
    eDateTime = moment(this.dateTimePickerForm.get('endDate').value).format('DD/MM/YYYY') + ' ' +
                      this.dateTimePickerForm.get('endTimeHr').value + ':' +
                      this.dateTimePickerForm.get('endTimeMin').value
    if (moment(sDateTime, "DD/MM/YYYY HH:mm").isAfter(moment(eDateTime, "DD/MM/YYYY HH:mm"))) {
      this.toastService.showToast('Start Date/Time can not occur after End Date/Time', 'danger');
    } else {
      if (this.showTime == true) {
        sDateTime = moment(this.dateTimePickerForm.get('startDate').value).format('DD/MM/YYYY') + ' ' +
                          this.dateTimePickerForm.get('startTimeHr').value + ':' +
                          this.dateTimePickerForm.get('startTimeMin').value
        eDateTime = moment(this.dateTimePickerForm.get('endDate').value).format('DD/MM/YYYY') + ' ' +
                          this.dateTimePickerForm.get('endTimeHr').value + ':' +
                          this.dateTimePickerForm.get('endTimeMin').value
        this.dateReset.emit({
          startDateTime: moment(sDateTime, "DD/MM/YYYY HH:mm"),
          endDateTime: moment(eDateTime, "DD/MM/YYYY HH:mm")
        })
      } else {
        sDateTime = moment(this.dateTimePickerForm.get('startDate').value).format('DD/MM/YYYY');
        eDateTime = moment(this.dateTimePickerForm.get('endDate').value).format('DD/MM/YYYY');
        this.dateSet.emit({
          startDateTime: moment(sDateTime, "DD/MM/YYYY"),
          endDateTime: moment(eDateTime, "DD/MM/YYYY")
        })
      }
    }
  }

  resetDate() {
    let sDateTime, eDateTime;
    this.dateTimePickerForm.get('startDate').patchValue(this.startDt);
    this.dateTimePickerForm.get('startTimeHr').patchValue(this.startTimeHr);
    this.dateTimePickerForm.get('startTimeMin').patchValue(this.startTimeMin);

    this.dateTimePickerForm.get('endDate').patchValue(this.endDt);
    this.dateTimePickerForm.get('endTimeHr').patchValue(this.endTimeHr);
    this.dateTimePickerForm.get('endTimeMin').patchValue(this.endTimeMin);

    if (this.showTime == true) {
      sDateTime = moment(this.dateTimePickerForm.get('startDate').value).format('DD/MM/YYYY') + ' ' +
                        this.dateTimePickerForm.get('startTimeHr').value + ':' +
                        this.dateTimePickerForm.get('startTimeMin').value
      eDateTime = moment(this.dateTimePickerForm.get('endDate').value).format('DD/MM/YYYY') + ' ' +
                        this.dateTimePickerForm.get('endTimeHr').value + ':' +
                        this.dateTimePickerForm.get('endTimeMin').value
      this.dateReset.emit({
        startDateTime: moment(sDateTime, "DD/MM/YYYY HH:mm"),
        endDateTime: moment(eDateTime, "DD/MM/YYYY HH:mm")
      })
    } else {
      sDateTime = moment(this.dateTimePickerForm.get('startDate').value).format('DD/MM/YYYY');
      eDateTime = moment(this.dateTimePickerForm.get('endDate').value).format('DD/MM/YYYY');
      this.dateReset.emit({
        startDateTime: moment(sDateTime, "DD/MM/YYYY"),
        endDateTime: moment(eDateTime, "DD/MM/YYYY")
      })
    }
  }

  startDateChanged() {
    this.endDateMin = moment(this.dateTimePickerForm.get('startDate').value);
  }

  endDateChanged() {
    this.startDateMax = moment(this.dateTimePickerForm.get('endDate').value);
  }

}
