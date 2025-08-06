import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalController ,IonHeader, IonToolbar, IonIcon, IonTitle, IonContent, IonInput, IonButton, IonLabel } from '@ionic/angular/standalone';
import { ISpecificationDetails, ISpecifications } from 'src/app/models/ventures.modal';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-specifications',
  templateUrl: './specifications.component.html',
  styleUrls: ['./specifications.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonIcon,IonTitle,IonContent,IonInput,IonButton,FormsModule,NgIf,IonLabel,NgFor,],
  providers:[ModalController],
})
export class SpecificationsComponent  implements OnInit {

  @Input() specifications: ISpecifications[] = [];
  @Input()   user: any;
  title: string | any;
  loading = false;
  asp = -1;



  specificationDetails: ISpecificationDetails = this.initiateSpecificationDetails();


  constructor(private modalController: ModalController, private toast: ToastService) {
   }

  ngOnInit(): void {
    if(this.specifications === undefined) {
      this.specifications = [];
    }

   }

  initiateSpecification() {

    return {
      title: null,
      specifications: []
    };

  }
  initiateSpecificationDetails():ISpecificationDetails {

    return {
      key: null,
      value: null
    };

  }


  save(): void {
      if (this.loading === true) {
        return;
      }

      this.loading = true;


      this.specifications[this.asp].specifications.push(this.specificationDetails);

      this.specificationDetails = this.initiateSpecificationDetails();

      this.loading = false;

  }
  add() {

      if (this.loading === true) {
        return;
      }

      if(this.title === undefined || this.title.trim() === '') {
        this.toast.showMessage('Please Enter Specfication Title');
        return;
      }

        this.asp = this.specifications.length - 1;
        this.asp += 1;


      // this.specifications[this.asp] = {
      //   title: this.title,
      //   specifications: []
      // };

      this.specifications.push({
        title: this.title,
        specifications: []
      });

      this.title = null;

      // this.specifications.push({
      //   title: this.title,
      //   specifications: [this.initiateSpecificationDetails()]
      // });

  }

  keyChanged(event: any, i: number) {

      this.specifications[this.asp].specifications[i].key = event.srcElement.innerText;
  }

  valueChanged(event: any, i: number) {
    this.specifications[this.asp].specifications[i].value = event.srcElement.innerText;
  }

  deleteSpecification(i: number) {

   

    this.specifications[this.asp].specifications.splice(i, 1);

  }

  deleteMainSpecification(i: number) {
      

      this.specifications.splice(i, 1);

      if(this.specifications.length === 0) {
        this.asp = -1;
      }
  }

  delete() {
   // this.specifications[this.asp] = this.initiateSpecification();
  //  this.specificationDetails= this.initiateSpecificationDetails();



   this.specifications.splice(this.asp, 1);

   this.asp -= 1;

   if(this.specifications.length === 0) {
    this.specifications = [];
    this.asp = -1;
   }  



  }

  dismiss() {


      this.modalController.dismiss(this.specifications);
  }
}
