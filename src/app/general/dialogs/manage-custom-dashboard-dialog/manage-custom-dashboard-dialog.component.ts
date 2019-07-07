import { Component, OnInit, Inject } from '@angular/core';
import { CustomDashboard } from 'app/models/custom-dashboard';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

@Component({
  selector: 'manage-custom-dashboard-dialog',
  templateUrl: './manage-custom-dashboard-dialog.component.html',
  styleUrls: ['./manage-custom-dashboard-dialog.component.scss']
})
export class ManageCustomDashboardDialogComponent implements OnInit {
  action: string;
  customDashboard: CustomDashboard;
  tags: string[] = [];

  // chips config
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  customDashboardConfigForm = new FormGroup({
    dashboardID: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  });

  constructor(private dialogRef: MatDialogRef<ManageCustomDashboardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public customDashboardData: any
  ) {}


  ngOnInit() {
    this.action = this.customDashboardData.action;
    this.customDashboard = this.customDashboardData.customDashboard;
    console.log("Custom Dashboard in Dialog", this.customDashboard);
    if (this.action == 'edit') {
      this.initializeCustomDashboardConfigForm();
    }
  }

  initializeCustomDashboardConfigForm() {
    this.customDashboardConfigForm.get('dashboardID').patchValue(this.customDashboard.dashboardID);
    this.customDashboardConfigForm.get('type').patchValue(this.customDashboard.type);
    this.customDashboardConfigForm.get('description').patchValue(this.customDashboard.description);
    this.tags = this.customDashboard.tags;
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our tag
    if ((value || '').trim()) {
      this.tags.push( value.trim() );
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTag(tag: any): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  buildCustomDashboard(formData) {
    this.customDashboard.dashboardID = formData.dashboardID;
    this.customDashboard.type = formData.type;
    this.customDashboard.description = formData.description;
    this.customDashboard.tags = this.tags;
    this.dialogRef.close({customDashboard: this.customDashboard});
  }
}
