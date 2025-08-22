import { AsyncPipe } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  Input,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular/standalone';
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
import { RealestateCardComponent } from '../../components/realestate-card/realestate-card.component';
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
import { Router } from '@angular/router';
import { IProperty, IPropertyImage } from 'src/app/models/property.model';
import { AgentService } from 'src/app/more/services/agent.service';

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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomemainComponent implements OnInit {
  private modalController = inject(ModalController);
  private auth = inject(AuthService);
  @Input() uid: string | null = null; // supply your authenticated uid
  private router = inject(Router);
  private toast = inject(ToastController);
  private svc = inject(AgentService);
  private afs = inject(Firestore);

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
  constructor() {
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

  async productlist(actionType: string) {
    const modal = await this.modalController.create({
      component: PropertieslistComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
      componentProps: { actionType },
    });
    return modal.present();
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

  readonly pageError = signal<string | null>(null);

  private getUid(): string {
    return this.uid ?? 'demo-uid'; // replace with your auth source
  }

  async openAgentConfirmation() {
    const modal = await this.modalController.create({
      component: AgentconfirmationComponent,
      componentProps: { uid: this.getUid() },
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    return await modal.present();
  }

  async no() {
    try {
      await this.svc.recordTerms(this.getUid(), 'v1');
      const t = await this.toast.create({
        message: 'Okay. You are set as a normal user.',
        duration: 2000,
        position: 'top',
      });
      await t.present();
      await this.router.navigate(['/']);
    } catch (e: any) {
      this.pageError.set(e?.message || 'Failed to update user type.');
    }
  }

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
      video: '',
    }));

    // Price preference: price → costOfProperty → rent
    const rawPrice = d.priceOfSale ?? d.priceOfRent ?? 0;
    const price = Number(rawPrice) || 0;

    // Sizes formatted as strings
    const size = d.propertySize ?? '—';
    const sizeStr = String(size);

    return {
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      id,
      propertyTitle: String(d.propertyTitle ?? '—'),
      priceOfSale: Number(d.priceOfSale ?? 0),
      priceOfRent: Number(d.priceOfRent ?? 0),
      priceOfRentType: String(d.priceOfRentType ?? '—'),
      addressOfProperty: String(d.addressOfProperty ?? '—'),
      houseType: String(d.houseType ?? '—'),
      bhkType: String(d.bhkType ?? '—'),
      propertySize: Number(d.propertySize ?? 0),
      propertyImages,
      saleType: String(d.saleType ?? 'sale') as 'sale' | 'rent',
      category: String(d.category ?? 'residential') as
        | 'residential'
        | 'commercial'
        | 'plots'
        | 'lands',
      agentName: String(d.agentName ?? '—'),
      propertyId: String(d.propertyId ?? id),
      commercialType: String(d.commercialType ?? '—'),
      floor: String(d.floor ?? '—'),
      propertyStatus: String(d.propertyStatus ?? 'Available'),
      houseCondition: String(d.houseCondition ?? '—'),
      rooms: Number(d.rooms ?? 0),
      furnishingType: String(d.furnishingType ?? '—'),
      commercialSubType: String(d.commercialSubType ?? '—'),
      securityDeposit: Number(d.securityDeposit ?? 0),
      propertySizeBuiltup: Number(d.propertySizeBuiltup ?? 0),
      sizeBuiltupUnits: String(d.sizeBuiltupUnits ?? '—'),
      northFacing: String(d.northFacing ?? '—'),
      northSize: Number(d.northSize ?? 0),
      southFacing: String(d.southFacing ?? '—'),
      southSize: Number(d.southSize ?? 0),
      eastFacing: String(d.eastFacing ?? '—'),
      eastSize: Number(d.eastSize ?? 0),
      westFacing: String(d.westFacing ?? '—'),
      westSize: Number(d.westSize ?? 0),
      toilets: Number(d.toilets ?? 0),
      poojaRoom: Number(d.poojaRoom ?? 0),
      livingDining: Number(d.livingDining ?? 0),
      kitchen: Number(d.kitchen ?? 0),
      amenities: Array.isArray(d.amenities) ? d.amenities : [],
      ageOfProperty: String(d.ageOfProperty ?? '—'),
      negotiable: Boolean(d.negotiable ?? false),
      images: Array.isArray(d.images)
        ? d.images.map((url, i) => ({ id: `${id}-${i}`, image: url }))
        : [],
      videoResources: Array.isArray(d.videoResources)
        ? d.videoResources.map((url, i) => ({ id: `${id}-${i}`, video: url }))
        : [],
      createdBy: String(d.createdBy ?? '—'),
      updatedBy: String(d.updatedBy ?? '—'),
      sortDate: Number(d.sortDate ?? 0),
      isDeleted: Boolean(d.isDeleted ?? false),
      deletedBy: String(d.deletedBy ?? '—'),
      deletedAt: d.deletedAt,
      status: String(d.status ?? 'Available'),
      fullSearchText: Array.isArray(d.fullSearchText) ? d.fullSearchText : [],
      totalPropertyUnits: String(d.totalPropertyUnits ?? '—'),
      facingUnits: String(d.facingUnits ?? '—'),
      lat: Number(d.lat ?? 0),
      lng: Number(d.lng ?? 0),
      description: String(d.description ?? '—'),
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
  houseType?: string;
  bhkType?: string;
  propertySize?: number | string;
  agentName?: string;
  propertyId?: string;
  propertyStatus?: string;
  costOfProperty?: number | string;
  priceOfSale?: number;
  priceOfRent?: number;
  priceOfRentType?: string;
  commercialType?: string;
  floor?: string;
  houseCondition?: string;
  rooms?: number;
  furnishingType?: string;
  commercialSubType?: string;
  securityDeposit?: number;
  propertySizeBuiltup?: number;
  sizeBuiltupUnits?: string;
  northFacing?: string;
  northSize?: number;
  southFacing?: string;
  southSize?: number;
  eastFacing?: string;
  eastSize?: number;
  westFacing?: string;
  westSize?: number;
  toilets?: number;
  poojaRoom?: number;
  livingDining?: number;
  kitchen?: number;
  amenities?: string[];
  ageOfProperty?: string;
  negotiable?: boolean;
  lat?: number;
  lng?: number;
  description?: string;
  videoResources?: string[];
  createdBy?: string;
  updatedBy?: string;
  sortDate?: number;
  isDeleted?: boolean;
  deletedBy?: string;
  deletedAt?: any;
  status?: string;
  fullSearchText?: string[];
  totalPropertyUnits?: string;
  facingUnits?: string;

  createdAt?: any;
  updatedAt?: any;
  // …any other fields you store
};
