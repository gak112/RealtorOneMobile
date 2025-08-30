import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toastr = inject(ToastController);


    async showError(msg: any) {
        const toast = await this.toastr.create({
          message: msg,
          position: 'bottom',
          color: 'danger',
      //    showCloseButton: true,
          duration: 2000
        });
        toast.present();
      }


      async showMessage(msg: any, time = 2000) {
        const toast = await this.toastr.create({
          message: msg,
          position: 'top',
          color: 'primary',
        //  showCloseButton: true,
          duration: time
        });
        toast.present();
      }
}
