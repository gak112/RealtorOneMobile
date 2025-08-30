import { Component, OnInit, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonicModule } from '@ionic/angular';
import { ModalController ,IonHeader, IonToolbar, IonButton, IonButtons, IonIcon, IonTitle, IonContent, IonLabel } from '@ionic/angular/standalone';
import { LanguageSettingsData } from 'src/app/languages/data/language/language.data';
import { ILanguage } from 'src/app/languages/interface/language/language.interface';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonButtons,IonIcon,IonTitle,IonContent,IonLabel,],
  providers:[ModalController],
})
export class LanguageComponent  implements OnInit {
private languageService = inject(LanguageService);
private auth = inject(AuthService);
private afs = inject(AngularFirestore);
private toast = inject(ToastService);
private modalController = inject(ModalController);

// action = 'english';

lngData: ILanguage;
action = 'telugu';

language: string;
user: any;

constructor() {

    this.language = environment.language;

    this.lngData = new LanguageSettingsData().getData(environment.language);
 //   this.languagePageData = ((new LanguagePageData).getdata(environment.language));

 }

ngOnInit(): void {



  // this.auth.user$.subscribe(user => {
  //   this.user = user;


  //   if(user.language) {
  //     this.action = user.language;
  //   }

  //   this.lngData = new LanguageSettingsData().getData(this.user?.language || 'english');



  // });

    switch (environment.language) {
        case 'telugu':
          this.action = 'telugu';
          break;
        case 'hindi':
          this.action = 'hindi';
          break;
        case 'english':
          this.action = 'english';
          break;
      }
 }


changeLanguage(language: string) {

    this.action = language;


    this.lngData = new LanguageSettingsData().getData(language);
    if (this.user) {

      this.afs
        .doc(`users/${this.user.uid}`)
        .update({ language })
        .then((snap) => {
          this.toast.showMessage('successfully updated', 1000);
        });
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

//     async changeLanguage(lan) {
//          await Storage.set({key: 'language', value: lan});
//          environment.language = lan;
//          this.language = lan;
//          this.languageService.language.next(this.language);
//   }

}
