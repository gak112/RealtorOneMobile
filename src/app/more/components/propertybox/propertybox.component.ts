import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonIcon, IonSkeletonText, ModalController } from '@ionic/angular/standalone';
import { PostfullviewComponent } from 'src/app/home/pages/postfullview/postfullview.component';
import { ToastService } from 'src/app/services/toast.service';
import { EditpropertyComponent } from '../../pages/editproperty/editproperty.component';
import { PropertiesviewsComponent } from '../../pages/propertiesviews/propertiesviews.component';
import Swal from 'sweetalert2';
import { PostUserHeaderComponent } from 'src/app/search/components/post-user-header/post-user-header.component';
import { register } from 'swiper/element';
import { addIcons } from 'ionicons';
import { create, documentText, ellipsisVerticalOutline, trash } from 'ionicons/icons';
import { PostLikesComponent } from 'src/app/search/components/post-likes/post-likes.component';
register();

@Component({
  selector: 'app-propertybox',
  templateUrl: './propertybox.component.html',
  styleUrls: ['./propertybox.component.scss'],
  standalone: true,
  imports: [IonIcon,IonSkeletonText,PostLikesComponent,PostUserHeaderComponent],
  providers:[ModalController],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PropertyboxComponent implements OnInit {
  @Input() hit: any;
  @Input() user: any;
  constructor(private modalController: ModalController,
    /*private afs: AngularFirestore,*/
    private toast: ToastService) {
    addIcons({ documentText,ellipsisVerticalOutline,create,trash, })
  }

  onSwiper(swiper: any) {
  }
  onSlideChange() {
  }

  ngOnInit(): void {
    return
  }

  async openFullview() {
    const modal = await this.modalController.create(
      {
        component: PostfullviewComponent,
        componentProps: { property: this.hit, user: this.user }
      }
    );
    return await modal.present();
  }
  async editProperty(hit: any) {
    const modal = await this.modalController.create(
      {
        component: EditpropertyComponent,
        componentProps: { hit }
      }
    );
    return await modal.present();
  }

  async propertyViews() {
    const modal = await this.modalController.create(
      {
        component: PropertiesviewsComponent,
        componentProps: { hit: this.hit, user: this.user }
      }
    );
    return await modal.present();
  }

  deleteIt(hit: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this!',
      //  type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.value) {
        this.delete(hit);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your Event is safe :)', 'error');
      }
    });
  }

  delete(hit: { id: any; }) {
    // this.afs
    //   .doc(`requests/${hit.id}`)
    //   .delete()
    //   .then((val: any) => {
    //     this.toast.showMessage(`Successfully Deleted`);
    //   });
  }
}
