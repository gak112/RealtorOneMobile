import { Component, OnInit } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonSearchbar,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { ChatsData } from 'src/app/languages/data/chats.data';
import { environment } from 'src/environments/environment';
import { ChatfullviewComponent } from '../chatfullview/chatfullview.component';
import { IChats } from 'src/app/languages/interface/chats.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonLabel,
    IonIcon,
    IonContent,
    IonImg,
    IonSearchbar,
  ],
  providers: [ModalController],
})
export class FriendsComponent implements OnInit {
  chatsData: IChats;
  user: any;
  constructor(
    private modalController: ModalController,
    private auth: AuthService
  ) {
    this.chatsData = new ChatsData().getData(environment.language);
  }

  ngOnInit(): void {
    return;
    // this.auth.user$.subscribe(user => {
    //     this.user = user;
    //       this.chatsData = new ChatsData().getData(this.user?.language || 'english');
    // });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async openChatFullview() {
    const modal = await this.modalController.create({
      component: ChatfullviewComponent,
    });
    return await modal.present();
  }
}
