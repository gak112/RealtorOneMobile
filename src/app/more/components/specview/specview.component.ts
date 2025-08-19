import { CommonModule, NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  ModalController,
  IonLabel,
  IonIcon,
  IonButton,
} from '@ionic/angular/standalone';
import { SpecificationsComponent, SpecSection } from '../specifications/specifications.component';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';

@Component({
  selector: 'app-specview',
  templateUrl: './specview.component.html',
  styleUrls: ['./specview.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonLabel, NgFor],
  providers: [ModalController],
})
export class SpecviewComponent implements OnInit {
  @Input() specifications: SpecSection[] = [];
  @Input() user: any;
  constructor(private modalController: ModalController) {}

  ngOnInit(): void {
    return;
  }

  keyChanged(event: any, i: number, j: number) {
    this.specifications[i].specifications[j].key = event.srcElement.innerText;
  }

  valueChanged(event: any, i: number, j: number) {
    this.specifications[i].specifications[j].value = event.srcElement.innerText;
  }

  async openSpecifications() {
    const modal = await this.modalController.create({
      component: SpecificationsComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
  }
}
