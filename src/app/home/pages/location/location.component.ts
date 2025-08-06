import {  NgIf } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonSearchbar, IonTitle, IonToolbar, ModalController,  } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronForwardOutline, locationOutline, location } from 'ionicons/icons';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LivelocationComponent } from 'src/app/home/components/livelocation/livelocation.component';


declare var google: { maps: { places: { AutocompleteService: new () => any; }; Geocoder: new () => any; }; };

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonIcon,IonTitle,IonSearchbar,IonContent,IonLabel,LivelocationComponent,IonList,IonItem,NgIf,],
  providers:[ModalController],
})
export class LocationComponent implements OnInit {

  places: any[] = [];
  query!: string;
  placesSub!: Subscription;
  private _places = new BehaviorSubject<any[]>([]);

  get search_places() {
    return this._places.asObservable();
  }

  constructor(private zone: NgZone, private modalController: ModalController) { 
    addIcons({ chevronBackOutline, location, chevronForwardOutline, locationOutline })
  }

  ngOnInit(): void {
    this.placesSub = this.search_places.subscribe({
      next: (places) => {
        this.places = places;
      },
      error: (e) => {
      }
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async onSearchChange(event: any) {
    this.query = event.detail.value;
    if (this.query.length > 0) await this.getPlaces();
  }

  async getPlaces() {
    try {
      let service = new google.maps.places.AutocompleteService();
      service.getPlacePredictions({
        input: this.query,
        componentRestrictions: {
          country: 'IN'
        }
      }, (predictions: any[] | null) => {
        let autoCompleteItems: any[] = [];
        this.zone.run(() => {
          if (predictions != null) {
            predictions.forEach(async (prediction: { description: any; structured_formatting: { main_text: any; }; }) => {
              let latLng: any = await this.geoCode(prediction.description);
              const places = {
                title: prediction.structured_formatting.main_text,
                address: prediction.description,
                lat: latLng.lat,
                lng: latLng.lng
              };
              autoCompleteItems.push(places);
            });
            this._places.next(autoCompleteItems);
          }
        });
      });
    } catch (e) {
    }
  }

  geoCode(address: any) {
    let latlng = { lat: '', lng: '' };
    return new Promise((resolve, reject) => {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': address }, (results: {
        geometry: {
          location: {
            lat(): string; lng: () => string;
          };
        };
      }[]) => {
        latlng.lat = results[0].geometry.location.lat();
        latlng.lng = results[0].geometry.location.lng();
        resolve(latlng);
      });
    });
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy(): void {
    if (this.placesSub) this.placesSub.unsubscribe();
  }

}
