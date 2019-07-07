import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastService } from './toast.service';
import { Observable } from 'rxjs';

@Injectable()
export class ConnectivityService {

  constructor(private toastService: ToastService,)
  {}

  getConnectivity(){
    if(navigator.onLine){
      return true;
    } else{
      return false;
    }
  }
}
