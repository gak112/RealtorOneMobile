import { IChats } from '../interface/chats.interface';

export class ChatsData {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    chatsData: IChats= {
        chats: '',
        selectContact: '',
        contacts: '',
    };
    getData(language) {
        if(language === 'telugu') {
            this.chatsData.chats='చాట్స్';
            this.chatsData.selectContact='సెలెక్ట్ కాంటాక్ట్';
            this.chatsData.contacts='కాంటాక్ట్స్';
        }
        if(language === 'hindi') {

            this.chatsData.chats='चैट';
            this.chatsData.selectContact='संपर्क चुनें';
            this.chatsData.contacts='संपर्क';
        }
        if(language === 'english') {
            this.chatsData.chats='Chats';
            this.chatsData.selectContact='Select Contact';
            this.chatsData.contacts='Contacts';
        }
        return this.chatsData;
    }
}
