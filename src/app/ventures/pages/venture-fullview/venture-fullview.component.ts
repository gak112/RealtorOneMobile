import { CommonModule, NgFor } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { register } from 'swiper/element';
import { VenturefloordetailsComponent } from '../venturefloordetails/venturefloordetails.component';
import { addIcons } from 'ionicons';
import { chevronBackOutline, locationOutline, logoFacebook, logoInstagram, logoTwitter } from 'ionicons/icons';
import { AmentitycardComponent } from 'src/app/home/components/amentitycard/amentitycard.component';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonImg, IonLabel, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
register();

@Component({
  selector: 'app-venture-fullview',
  templateUrl: './venture-fullview.component.html',
  styleUrls: ['./venture-fullview.component.scss'],
  standalone: true,
  imports: [IonHeader,IonToolbar,IonButtons,IonIcon,IonTitle,IonContent,IonImg,IonLabel,AmentitycardComponent,NgFor,IonButton],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers:[ModalController],
})
export class VentureFullviewComponent implements OnInit {

  @Input() venture: any;
  safeURL: any;

  constructor(private modalController: ModalController,
    private sanitizer: DomSanitizer,) {
    addIcons({ chevronBackOutline, locationOutline, logoFacebook, logoTwitter, logoInstagram });
  }

  ngOnInit() {
    this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.venture?.brochure);
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async openVentureFloorDetails() {
    const modal = await this.modalController.create({
      component: VenturefloordetailsComponent,
    });
    return await modal.present();
  }
}
