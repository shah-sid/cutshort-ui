import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'action-confirm',
  templateUrl: './action-confirm.component.html',
  styleUrls: ['./action-confirm.component.scss']
})
export class ActionConfirmComponent implements OnInit {
  title: string;
  icon: string;
  messageLine1: string;
  messageLine2: string;
  successText: string;
  cancelText: string;

  constructor(private dialogRef: MatDialogRef<ActionConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: any) { }

  ngOnInit() {
    this.title = this.dialogData.title || 'Confirm Action';
    this.icon = this.dialogData.icon || '../../../../assets/img/essentials/warning.svg';
    this.messageLine1 = this.dialogData.messageLine1 || 'Are you sure you want to continue ?';
    this.messageLine2 = this.dialogData.messageLine2;
    this.successText = this.dialogData.successText || 'Continue';
    this.cancelText = this.dialogData.cancelText || 'Cancel';
  }

}
