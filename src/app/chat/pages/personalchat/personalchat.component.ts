import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonSkeletonText,
  IonToolbar,
  IonSearchbar,
  IonTitle,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';

import {
  arrowRedoOutline,
  checkmarkCircle,
  notificationsOutline,
  ellipsisHorizontal, camera, addCircle
} from 'ionicons/icons';
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { InvididualChat } from 'src/app/models/chat.model';
import { AuthService } from 'src/app/services/auth.service';
import {
  ChatData,
  IndividualBoxComponent,
} from '../../components/individual-box/individual-box.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-personalchat',
  templateUrl: './personalchat.component.html',
  styleUrls: ['./personalchat.component.scss'],
  standalone: true,
  imports: [
    IonSearchbar,
    IonSkeletonText,
    IonHeader,
    IonToolbar,
    IonContent,
    IndividualBoxComponent,
    IonLabel,
    IonIcon,
    IonSkeletonText,
    ReactiveFormsModule,
    IonTitle,
  ],
})

export class PersonalchatComponent {
  chatSegment = signal<'all' | 'unRead'>('all');

  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  // private notificationService = inject(NotificationsService);

  searchCtrl = this.formBuilder.control('');

  searchQuery = toSignal(
    this.searchCtrl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    )
  );
  // notifyCount = computed(() => this.notificationService.notifyCount());

  user$ = this.authService.user$;
  user = toSignal(this.user$);
  firestore = inject(AngularFirestore);
  chats$ = this.user$.pipe(
    switchMap((user) => {
      if (!user?.uid) {
        // Return empty array if user is not available
        return of([]);
      }
      return this.firestore
        .collection<InvididualChat>('chats', (ref) =>
          ref
            .where('userIds', 'array-contains', user.uid)
            .orderBy('updatedAt', 'desc')
        )
        .valueChanges({ idField: 'id' });
    })
  );
  chats = toSignal(this.chats$);

  showChats = computed(() => {
    let chats = this.chats() ?? [];
    const query = this.searchQuery() ?? '';
    const chatDataArray = this.chatDataArray() ?? [];
    const chatSegment = this.chatSegment();
    if (chatSegment === 'unRead') {
      const unSeenChats = chatDataArray
        .filter((c) => (c?.unSeenMessages ?? 0) > 0)
        .map((c) => c.chatId);

      chats = chats.filter((c) => unSeenChats.includes(c.id ?? c.objectID));
    }
    if (query && query.length > 0) {
      const searchResult = chatDataArray
        .filter(
          (c) =>
            c.userName?.toLowerCase().includes(query.toLowerCase()) ||
            c.userMobileNumber?.toLowerCase().includes(query.toLowerCase())
        )
        .map((c) => c.chatId);
      chats = chats.filter((c) => searchResult.includes(c.id ?? c.objectID));
    }
    return chats.map((c) => c.id || c.objectID || '');
  });

  async openRequestForm() {
    this.router.navigate(['groups', 'form', 'new']);
  }

  constructor() {
    addIcons({ checkmarkCircle, notificationsOutline, arrowRedoOutline, ellipsisHorizontal, camera, addCircle });
  }


  async openNotifications() {
    this.router.navigate(['notifications']);
  }

  async openProfile() {
    const userId = this.user()?.uid;
    if (userId) {
      this.router.navigateByUrl('/more/more-profile/' + userId);
    }
  }

  chatData = signal<Record<string, ChatData>>({});

  chatDataArray = computed(() => Object.values(this.chatData()));

  chatDataUpdate(event: ChatData) {
    this.chatData.update((c) => {
      return {
        ...c,
        [event.chatId]: { ...c[event.chatId], ...event } as ChatData,
      };
    });
  }
}
