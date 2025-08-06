import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ModalController ,IonLabel, IonImg, IonIcon } from '@ionic/angular/standalone';
import { PaymentsData } from 'src/app/languages/data/more/payments.data';
import { IPayments } from 'src/app/languages/interface/more/payments.interface';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-paymentcard',
  templateUrl: './paymentcard.component.html',
  styleUrls: ['./paymentcard.component.scss'],
  standalone:true,
  imports:[IonImg,IonLabel,IonIcon,],
  providers:[ModalController],
})
export class PaymentcardComponent  implements OnInit {

  profileData!: IPayments;
  language!: string;
  constructor(private modalController: ModalController, private languageService: LanguageService) { }

  ngOnInit(): void {
        this.languageService.language.subscribe(language => {
              this.profileData = new PaymentsData().getData(language);
              this.language = language;
            });
   }

  dismiss() {
   this.modalController.dismiss();
  }

}
