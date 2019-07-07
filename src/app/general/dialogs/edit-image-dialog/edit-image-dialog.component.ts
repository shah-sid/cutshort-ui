import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'edit-image-dialog',
  templateUrl: './edit-image-dialog.component.html',
  styleUrls: ['./edit-image-dialog.component.scss']
})
export class EditImageDialogComponent implements OnInit {
  selectedImage: any;
  croppedImage: any;
  constructor(private dialogRef: MatDialogRef<EditImageDialogComponent>,
              private toastService: ToastService,
    @Inject(MAT_DIALOG_DATA) private profileData: any) { }

  ngOnInit() {
    this.selectedImage = this.profileData.selectedImage;
  }

  imageCropped(croppedImage) {
    this.croppedImage = croppedImage;
  }

  imageLoaded() {
    console.log("Image Loaded");
  }

  loadImageFailed() {
    console.log("Image load failed");
    this.toastService.showToast('Failed To Load Image. Try again!', "danger");
    this.dialogRef.close();
  }

}
