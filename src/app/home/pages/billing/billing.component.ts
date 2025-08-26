
import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonButton, IonContent, IonHeader, IonIcon, IonImg, IonLabel, IonTitle, IonToolbar, ModalController, NavController } from '@ionic/angular/standalone';
import { ToastService } from 'src/app/services/toast.service';
import { UpgradeplanComponent } from 'src/app/home/pages/upgradeplan/upgradeplan.component';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonIcon,IonTitle,IonContent,IonImg,IonLabel,IonButton],
  providers:[ModalController],
})
export class BillingComponent  implements OnInit {
  @Input() request: any;
  @Input() user: any;
  loading= false;
  paymentProcessing = false;
  
  finalPaymentProcessing = false;
  paymentStarted = false;
    constructor(private modalController: ModalController,
      private afs: AngularFirestore, private toast: ToastService, private nav: NavController) { }
  
    ngOnInit() {
      return
    }
  
    dismiss() {
      this.modalController.dismiss();
    }
  
    
  
    async goToSubcriptions() {
      const modal = await this.modalController.create({
        component: UpgradeplanComponent,
      });
      return await modal.present();
    }
  

}
