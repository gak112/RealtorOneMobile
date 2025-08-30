import { Component, OnInit } from '@angular/core';
import { IonButtons, IonContent, IonHeader, IonIcon, IonImg, IonLabel, IonSegment, IonSegmentButton, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { CompanybannersComponent } from '../../components/companybanners/companybanners.component';
import { AsyncPipe } from '@angular/common';
import { CompanyaboutComponent } from '../../components/companyabout/companyabout.component';
import { CompanymediaComponent } from '../../components/companymedia/companymedia.component';
import { CompanyteamComponent } from '../../components/companyteam/companyteam.component';
import { CompanyeventsComponent } from '../../components/companyevents/companyevents.component';
import { CompanycertificatesComponent } from '../../components/companycertificates/companycertificates.component';
import { CompanybranchesComponent } from '../../components/companybranches/companybranches.component';

@Component({
  selector: 'app-companyprofile',
  templateUrl: './companyprofile.component.html',
  styleUrls: ['./companyprofile.component.scss'],
  standalone: true,
  imports: [IonContent, CompanybannersComponent, IonToolbar, IonSegment, IonSegmentButton, IonLabel, CompanyaboutComponent, CompanymediaComponent, CompanyteamComponent, CompanyeventsComponent, CompanycertificatesComponent, CompanybranchesComponent, IonImg, IonButtons, IonIcon, IonHeader, AsyncPipe],
 
providers: [ModalController
  ],
})

export class CompanyprofileComponent implements OnInit {
segmentChanged: any;
action: any;
company$: any;
dismiss: any;

  constructor() { }

  ngOnInit() {
    return;
   }

}
