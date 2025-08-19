import { CommonModule, NgFor } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import {
  ModalController,
  IonLabel,
  IonIcon,
  IonButton,
} from '@ionic/angular/standalone';
import {
  SpecificationsComponent,
  SpecSection,
} from '../specifications/specifications.component';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';
import { addIcons } from 'ionicons';
import { create, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-specview',
  templateUrl: './specview.component.html',
  styleUrls: ['./specview.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonLabel, NgFor],
  providers: [ModalController],
})
export class SpecviewComponent implements OnInit {
  private modalController = inject(ModalController);
  @Input() specifications: SpecSection[] = [];
  @Input() user: any;
  constructor() {
    addIcons({
      create,
      trashOutline,
    });
  }

  ngOnInit(): void {
    return;
  }

  keyChanged(event: any, i: number, j: number) {
    this.specifications[i].specifications[j].key = event.srcElement.innerText;
  }

  valueChanged(event: any, i: number, j: number) {
    this.specifications[i].specifications[j].value = event.srcElement.innerText;
  }

  removeSection(index: number): void {
    this.specifications.splice(index, 1);
  }

  async openEditSection(index: number) {
    const sectionToEdit = this.specifications[index];
    const modal = await this.modalController.create({
      component: SpecificationsComponent,
      componentProps: {
        mode: 'edit',
        index,
        sections: [sectionToEdit], // pass only the target section
      },
      canDismiss: true,
      showBackdrop: true,
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (role === 'submit' && data?.sections) {
      const updated = [...this.specifications];
      // replace only that section (first returned section)
      updated[index] = (data.sections as SpecSection[])[0];
      this.specifications = updated;
    }
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
