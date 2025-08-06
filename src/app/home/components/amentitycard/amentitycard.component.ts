import { CommonModule, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonicModule } from '@ionic/angular';
import { IonImg, IonLabel, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-amentitycard',
  templateUrl: './amentitycard.component.html',
  styleUrls: ['./amentitycard.component.scss'],
  standalone: true,
  imports:[IonImg,IonLabel,NgIf],
  providers:[ModalController]
})
export class AmentitycardComponent implements OnInit {

  @Input() amenity: any;
  amenities: any;
  dummydate = {
    photo:"",
    amenity:""
  }
  
  constructor(/*private afs: AngularFirestore*/) { }

  ngOnInit() {
    return
    // this.afs.collection(`amenities`, ref => ref.where('amenity', '==', this.amenity)).valueChanges().subscribe((data: any) => {
    //   this.amenities = data[0];
    // });
  }

}
