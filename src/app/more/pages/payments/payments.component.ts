import { Component, OnInit, inject } from '@angular/core';
import { IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { IPayments } from 'src/app/languages/interface/more/payments.interface';
import { LanguageService } from 'src/app/services/language.service';
import { PaymentsData } from 'src/app/languages/data/more/payments.data';
import { IonicModule } from '@ionic/angular';
import { PaymentcardComponent } from '../../components/paymentcard/paymentcard.component';


@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonButtons,IonIcon,IonTitle,IonContent,PaymentcardComponent,],
  providers:[ModalController],
})
export class PaymentsComponent  implements OnInit {
  private modalController = inject(ModalController);
  private languageService = inject(LanguageService);


  profileData!: IPayments;
      language: any;

      ngOnInit(): void {
            this.languageService.language.subscribe((language: any) => {
                  this.profileData = new PaymentsData().getData(language);
                  this.language = language;
                });
       }

      dismiss() {
       this.modalController.dismiss();
      }

}
