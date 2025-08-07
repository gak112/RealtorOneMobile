import { Component, inject, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonTitle, IonToolbar, ModalController, IonFooter } from '@ionic/angular/standalone';
import { ToastService } from 'src/app/services/toast.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss'],
  standalone: true,
  imports: [IonFooter, IonHeader,IonToolbar,IonButtons,IonIcon,IonTitle,IonContent,IonInput,FormsModule,IonButton,NgIf,],
})
export class ContactusComponent implements OnInit {

  private modalController = inject(ModalController);

  loading = false;
  name!: string;
  subject!: string;
  email!: string;
  message!: string;

  constructor(
    private toast: ToastService,/* private afs: AngularFirestore*/) {
    addIcons({ chevronBackOutline })
  }

  ngOnInit(): void {
    return;
  }

  dismiss() {
    this.modalController.dismiss();
  }

  submit() {
    if (this.loading === true) {
      return;
    }
    this.loading = true;


    if (this.subject) {
      if (this.subject.trim() === '') {
        this.toast.showError(
          'Please Enter Subject'
        );
        this.loading = false;
        return;
      }
    } else {
      this.toast.showError(
        'Please Enter Subject'
      );
      this.loading = false;
      return;
    }

    if (this.name) {
      if (this.name.trim() === '') {
        this.toast.showError(
          'Please Enter Name'
        );
        this.loading = false;
        return;
      }
    } else {
      this.toast.showError(
        'Please Enter Name'
      );
      this.loading = false;
      return;
    }


    const expression =
      /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

    const email: string = this.email;
    const result: boolean = expression.test(email); // true

    if (!result) {
      this.toast.showError(
        'Please Enter Valid Email'
      );
      this.loading = false;
      return;
    } else {

    }


    if (this.email === undefined) {
      if (this.email === '') {
        this.toast.showError(
          'Please Enter Email'
        );
        this.loading = false;
        return;
      } else {
        this.toast.showError(
          'Please Enter Email'
        );
        this.loading = false;
        return;
      }
    }

    if (this.message) {
      if (this.message.trim() === '') {
        this.toast.showError(
          'Please Enter Message'
        );
        this.loading = false;
        return;
      }
    } else {
      this.toast.showError(
        'Please Enter Message'
      );
      this.loading = false;
      return;
    }

    //  this.afs
    //    .collection(`contactus`)
    //    .add({
    //     subject: this.subject,
    //     name: this.name,
    //     email: this.email,
    //     message: this.message
    //     ,  createdAt: firebase.firestore.FieldValue.serverTimestamp() })
    //    .then(() => {
    //          this.toast.showMessage('Details Sent Successfully', 1000);
    //         this.modalController.dismiss();
    //         this.subject = '';
    //         this.name ='';
    //         this.email = '';
    //         this.message = '';
    //          this.loading = false;


    //    });
  }
}
