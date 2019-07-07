import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UserData } from '../../../models/user-data';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material';
import { EditImageDialogComponent } from '../../dialogs/edit-image-dialog/edit-image-dialog.component';
import { FilePickerDirective } from 'ngx-file-helpers';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  @Input('user') user: UserData;
  profilePicture: string;
  dialogRef;

  @ViewChild(FilePickerDirective)
  private filePicker;

  constructor(private auth: AuthService,
              private profileService: ProfileService,
              private dialog: MatDialog
  ) {
   }

  ngOnInit() {
    this.profilePicture = this.auth.getProfilePicture()
  }

  getSelectedImage($event) {
    console.log("selected image", $event);
    this.dialogRef = this.dialog.open(EditImageDialogComponent, {
      width: "600px",
      data: {
        selectedImage: $event.content
      }
    })
    this.filePicker.reset();
    this.dialogRef.afterClosed()
      .subscribe(image => {
        if (image != undefined) {
          this.profilePicture = image;
          this.profileService.uploadProfilePicture(image).subscribe();
        }
      })
  }
}
