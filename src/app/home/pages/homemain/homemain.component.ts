import { AsyncPipe } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RequestmenuComponent } from '../requestmenu/requestmenu.component';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonSearchbar,
  IonSkeletonText,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  business,
  chevronDownOutline,
  chevronForwardOutline,
  home,
  location,
  notificationsOutline,
} from 'ionicons/icons';
import { Observable } from 'rxjs';
import { AlerttabComponent } from 'src/app/alerts/pages/alerttab/alerttab.component';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';
import { AuthService } from 'src/app/services/auth.service';
import {
  IProperty,
  IPropertyImage,
  RealestateCardComponent,
} from '../../components/realestate-card/realestate-card.component';
import { AgentconfirmationComponent } from '../agentconfirmation/agentconfirmation.component';
import { BannersviewComponent } from '../bannersview/bannersview.component';
import { HomeItWorksComponent } from '../home-it-works/home-it-works.component';
import { LocationnewComponent } from '../locationnew/locationnew.component';
import { PostentryComponent } from '../postentry/postentry.component';
import { PropertieslistComponent } from '../propertieslist/propertieslist.component';
import { TrendingimagesComponent } from '../trendingimages/trendingimages.component';
import { VenturecreationComponent } from '../venturecreation/venturecreation.component';

import {
  Firestore,
  collection,
  collectionData,
  orderBy,
  query,
  limit,
} from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-homemain',
  templateUrl: './homemain.component.html',
  styleUrls: ['./homemain.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonLabel,
    IonIcon,
    IonContent,
    IonButton,
    IonImg,
    AsyncPipe,
    IonFab,
    IonFabButton,
    IonFabList,
    IonSkeletonText,
    RealestateCardComponent,
    IonSearchbar,
  ],
  providers: [ModalController],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomemainComponent implements OnInit {
  // propertyComponent = PostEntryComponent;
  propertyComponent = RequestmenuComponent;
  busniessComponent = VenturecreationComponent;
  user: any = true;
  properties$!: Observable<any>;
  banners$!: Observable<any>;
  banners: any = [
    {
      banner: 'https://ucarecdn.com/882d06f0-0cb7-44b0-a4e7-eafb7d811699/',
    },
    {
      banner: 'https://ucarecdn.com/14b9f950-fd97-4906-9926-179855c893b2/',
    },
  ];
  constructor(
    private modalController: ModalController,
    private auth: AuthService /* private afs: AngularFirestore*/
  ) {
    addIcons({
      chevronForwardOutline,
      home,
      business,
      notificationsOutline,
      location,
      chevronDownOutline,
    });
  }

  ngOnInit(): void {
    return;
    // this.auth.user$.subscribe(user => this.user = user);
    // this.properties$ = this.afs.collection('AdverstimentsProps').valueChanges({ idField: 'id' });
    // this.banners$ = this.afs.collection('banners').valueChanges({ idField: 'id' });
  }

  async openFormEntry() {
    // if(!this.user) {
    //   this.toast.showError('Please Login..');
    //   this.nav.navigateRoot('auth');

    //   return;
    // }

    const modal = await this.modalController.create({
      component: PostentryComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    return await modal.present();
  }

  async openLocation() {
    const modal = await this.modalController.create({
      component: LocationnewComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
      // component: LocationComponent,
    });
    return await modal.present();
  }

  async openHowITWorks() {
    const modal = await this.modalController.create({
      component: HomeItWorksComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    return await modal.present();
  }

  async bannersview() {
    const modal = await this.modalController.create({
      component: BannersviewComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    return await modal.present();
  }

  async openAgentConfirmation() {
    const modal = await this.modalController.create({
      component: AgentconfirmationComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    return await modal.present();
  }

  async manageAlerts() {
    const modal = await this.modalController.create({
      component: AlerttabComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    return await modal.present();
  }
  async trendingFV() {
    const modal = await this.modalController.create({
      component: TrendingimagesComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    return await modal.present();
  }

  async productlist(actionType: any) {
    const modal = await this.modalController.create({
      component: PropertieslistComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
      componentProps: { actionType },
    });
    return await modal.present();
  }

  async openVentureCreation() {
    const modal = await this.modalController.create({
      component: VenturecreationComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    return await modal.present();
  }

  async openRequestForm() {
    const modal = await this.modalController.create({
      component: RequestmenuComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    return await modal.present();
  }

  private afs = inject(Firestore);

  // Query: order by createdAt desc. Ensure you set createdAt = serverTimestamp() on create.
  private postsCol = collection(this.afs, 'posts');
  private q = query(this.postsCol, orderBy('createdAt', 'desc'), limit(200));

  private rows$: Observable<PostDoc[]> = collectionData(this.q, {
    idField: 'id',
  }) as Observable<PostDoc[]>;

  // Stream → signal; map docs to the IProperty shape your card expects
  readonly properties = toSignal<IProperty[]>(
    this.rows$.pipe(map((docs) => docs.map(this.toProperty)))
  );

  // basic loading signal (first render until we get anything)
  readonly loading = computed(() => this.properties().length === 0);

  private toProperty = (d: PostDoc): IProperty => {
    const id = d.id;

    // Build images array for the card
    const imgs: string[] = Array.isArray(d.images)
      ? d.images.filter(Boolean)
      : [];
    const propertyImages: IPropertyImage[] = imgs.map((url, i) => ({
      id: `${id}-${i}`,
      image: url,
    }));

    // Price preference: price → costOfProperty → rent
    const rawPrice = d.salePrice ?? d.costOfProperty ?? d.rent ?? 0;
    const price = Number(rawPrice) || 0;

    // Sizes formatted as strings
    const size = d.propertySize ?? '—';
    const sizeStr = String(size);

    return {
      id,
      propertyTitle: String(d.propertyTitle ?? '—'),
      salePrice: price,
      rentPrice: price,
      location: String(d.addressOfProperty ?? d.location ?? '—'),
      houseType: String(d.houseType ?? '—'),
      bhkType: String(d.bhkType ?? '—'),
      propertySize: sizeStr,
      propertyImages,
      category: String(d.category ?? '-'),
      agentName: String(d.agentName ?? '—'),
      propertyId: String(d.propertyId ?? id),
      saleType: String(d.saleType ?? '-'),
      propertyStatus: String(d.propertyStatus ?? 'Available'),
    };
  };
}

type PostDoc = {
  id: string;
  images?: string[];
  propertyTitle?: string;
  saleType?: string;
  category?: string;
  addressOfProperty?: string;
  location?: string;
  houseType?: string;
  bhkType?: string;
  propertySize?: number | string;
  agentName?: string;
  propertyId?: string;
  propertyStatus?: string;
  costOfProperty?: number | string;
  rent?: number | string;
  salePrice?: number | string;
  rentPrice?: number | string;

  createdAt?: any;
  // …any other fields you store
};
