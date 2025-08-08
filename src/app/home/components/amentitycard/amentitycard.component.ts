import { Component, input, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonImg, IonLabel, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-amentitycard',
  templateUrl: './amentitycard.component.html',
  styleUrls: ['./amentitycard.component.scss'],
  standalone: true,
  imports: [IonImg, IonLabel],
  providers: [ModalController],
})
export class AmentitycardComponent implements OnInit {
  amentity = input<IAmentity>();

  constructor(/*private afs: AngularFirestore*/) {}

  ngOnInit() {
    return;
    // this.afs.collection(`amenities`, ref => ref.where('amenity', '==', this.amenity)).valueChanges().subscribe((data: any) => {
    //   this.amenities = data[0];
    // });
  }
}

export interface IAmentity {
  id: string;
  name: string;
  image: string;
}
