/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component, NgZone, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonSearchbar, IonText, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { Subscription, BehaviorSubject } from 'rxjs';

declare var google;

@Component({
  standalone:true,
  selector: 'app-locationsearch',
  templateUrl: './locationsearch.component.html',
  styleUrls: ['./locationsearch.component.scss'],
  imports:[IonHeader,IonToolbar,IonTitle,IonSearchbar,IonContent,IonList,IonItem,IonIcon,IonLabel,IonText],
  providers:[ModalController],
})
export class LocationsearchComponent  implements OnInit {

  places: any[] = [];
  query: string;
  placesSub: Subscription;
  private _places = new BehaviorSubject<any[]>([]);

  get search_places() {
    return this._places.asObservable();
  }

  constructor(private zone: NgZone) {}

  ngOnInit(): void {
      this.placesSub = this.search_places.subscribe({
        next: (places) => {
          this.places = places;
        },
        error: (e) => {
        }
      });
  }

  async onSearchChange(event: any) {
    this.query = event.detail.value;
    if(this.query.length > 0) await this.getPlaces();
  }

  async getPlaces() {
    try {
      let service = new google.maps.places.AutocompleteService();
      service.getPlacePredictions({
        input: this.query,
        componentRestrictions: {
          country: 'IN'
        }
      }, (predictions) => {
        let autoCompleteItems = [];
        this.zone.run(() => {
          if(predictions != null) {
            predictions.forEach(async(prediction) => {
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
    } catch(e) {
    }
  }

  geoCode(address) {
    let latlng = {lat: '', lng: ''};
    return new Promise((resolve, reject) => {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({'address' : address}, (results) => {
        latlng.lat = results[0].geometry.location.lat();
        latlng.lng = results[0].geometry.location.lng();
        resolve(latlng);
      });
    });
  }

  ngOnDestroy(): void {
      if(this.placesSub) this.placesSub.unsubscribe();
  }


}
