import { Component, inject, input, model } from '@angular/core';
import { IonIcon, IonLabel, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { create, trashOutline } from 'ionicons/icons';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';
import {
  SpecificationsComponent,
  SpecSection,
} from '../specifications/specifications.component';

@Component({
  selector: 'app-specview',
  templateUrl: './specview.component.html',
  styleUrls: ['./specview.component.scss'],
  standalone: true,
  imports: [IonIcon, IonLabel],
  providers: [ModalController],
})
export class SpecviewComponent {
  private modalController = inject(ModalController);
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  readonly specifications = model<SpecSection[]>([]);
  readonly user = input<any>(undefined);
  constructor() {
    addIcons({
      create,
      trashOutline,
    });
  }

  removeSection(index: number): void {
    this.specifications().splice(index, 1);
    this.specifications.update((sections) =>
      sections.filter((_, j) => j !== index)
    );
  }

  async openEditSection(index: number) {
    const sectionToEdit = this.specifications()[index];
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
      const updated = [...this.specifications()];
      // replace only that section (first returned section)
      updated[index] = (data.sections as SpecSection[])[0];
      this.specifications.set(updated);
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
