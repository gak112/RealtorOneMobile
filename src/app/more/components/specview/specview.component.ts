import { CommonModule, NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-specview',
  templateUrl: './specview.component.html',
  styleUrls: ['./specview.component.scss'],
  standalone: true,
  imports: [IonLabel, NgFor,],
  providers:[ModalController],
})
export class SpecviewComponent implements OnInit {


  @Input() specifications: any;
  @Input() user: any;
  constructor(private modalController: ModalController) { }

  ngOnInit(): void {
    return
  }

  keyChanged(event: any, i: number, j: number) {

    this.specifications[i].specifications[j].key = event.srcElement.innerText;
  }

  valueChanged(event: any, i: number, j: number) {
    this.specifications[i].specifications[j].value = event.srcElement.innerText;
  }

  // async openSpecifications() {
  //     const modal = await this.modalController.create({
  //         component: SpecificationsComponent,
  //         componentProps: {user: this.user, specifications: this.specifications}
  //     });
  //      await modal.present();
  //      const { data } = await modal.onWillDismiss();
  //      if (data) {
  //          this.specifications=(data);
  //      }
  // }
}
