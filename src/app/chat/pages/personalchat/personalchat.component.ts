import { Component, OnInit } from '@angular/core';
import { ModalController, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, IonImg, IonSkeletonText, IonIcon } from '@ionic/angular/standalone';
import { ChatsData } from 'src/app/languages/data/chats.data';
import { IChats } from 'src/app/languages/interface/chats.interface';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { GroupchatComponent } from '../groupchat/groupchat.component';
import { FriendsComponent } from '../friends/friends.component';
import { ChatfullviewComponent } from '../chatfullview/chatfullview.component';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkDoneOutline, chevronForwardOutline, checkmarkOutline, cameraOutline, videocamOutline } from 'ionicons/icons';
import { NgFor } from '@angular/common';
@Component({
    selector: 'app-personalchat',
    templateUrl: './personalchat.component.html',
    styleUrls: ['./personalchat.component.scss'],
    standalone: true,
    imports: [IonHeader,IonToolbar,IonTitle,IonContent,IonImg,IonLabel,IonSkeletonText,IonIcon,NgFor,],
    providers:[ModalController]
})
export class PersonalchatComponent implements OnInit {

    chatsData: IChats;
    user: any;
    constructor(private modalController: ModalController, private auth: AuthService,) {
        this.chatsData = new ChatsData().getData(environment.language);

        addIcons({ checkmarkDoneOutline, chevronForwardOutline,  checkmarkOutline, cameraOutline, videocamOutline })
    }

    ngOnInit(): void {
        return
        // this.auth.user$.subscribe(user => {
        //     this.user = user;
        //       this.chatsData = new ChatsData().getData(this.user?.language || 'english');
        // });
    }

    async openFriends() {
        const modal = await this.modalController.create({
            component: FriendsComponent
        });
        return await modal.present();
    }

    async openChatFullview() {
        const modal = await this.modalController.create({
            component: ChatfullviewComponent
        });
        return await modal.present();
    }
    async openQuickStore() {
        const modal = await this.modalController.create({
            component: GroupchatComponent
        });
        return await modal.present();
    }

    dismiss() {
        this.modalController.dismiss();
    }

}
