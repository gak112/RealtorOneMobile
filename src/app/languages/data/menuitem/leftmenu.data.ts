

import { ILeftMenu } from './../../interface/menuitem/leftmenu.interface';


export class LeftMenuData {
    leftmenuData: ILeftMenu= {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        editDetails: '', Catelogs: '', orderInformation: '', myOrders: '',shippingAddress: '', qa:'',
        profile: '', darkMode:'',language:'', logout: '',from:'',sbpConsulting:'',accountPrivacy:'' , changePassword:''    ,
        myWishlist:''
    };
    getData(language) {
        if(language === 'telugu') {
            this.leftmenuData.editDetails='వివరాలను సవరించండి';
            this.leftmenuData.Catelogs='జాబితా';
            this.leftmenuData.orderInformation='ఆర్డర్ సమాచారం';
            this.leftmenuData.myOrders='మై ఆర్డర్స్';
            this.leftmenuData.shippingAddress='షిప్పింగ్ అడ్రస్';
            this.leftmenuData.qa='ప్రశ్నలు & జవాబు';
            this.leftmenuData.accountPrivacy='అకౌంట్ ప్రైవసీ';
            this.leftmenuData.profile='ప్రొఫైల్';
            this.leftmenuData.language='భాష';
            this.leftmenuData.changePassword='పాస్వర్డ్ మార్చండి';
            this.leftmenuData.logout='లాగ్ అవుట్';
            this.leftmenuData.from='పవర్డ్ బై';
            this.leftmenuData.sbpConsulting='ఎస్ బి పి కన్సల్టింగ్ ప్రైవేట్ లిమిటెడ్';
            this.leftmenuData.myWishlist='మై విష్ లిస్ట్';
        }
        if(language === 'hindi') {

            this.leftmenuData.editDetails='विवरण संपादित करें';
            this.leftmenuData.Catelogs='सूची';
            this.leftmenuData.orderInformation='आदेश की जानकारी';
            this.leftmenuData.myOrders='मेरे आदेश';
            this.leftmenuData.shippingAddress='शिपिंग पता';
            this.leftmenuData.qa='प्रशन जवाब';
            this.leftmenuData.accountPrivacy='प्रश्न जवाब';
            this.leftmenuData.profile='प्रोफ़ाइल';
            this.leftmenuData.language='भाषा';
            this.leftmenuData.changePassword='पासवर्ड बदलें';
            this.leftmenuData.logout='लोग आउट';
            this.leftmenuData.from='पवेरेद बी';
            this.leftmenuData.sbpConsulting='यस बी प कंसल्टिंग प्राइवेट लिमिटेड';
            this.leftmenuData.myWishlist='माय विशलिस्ट';

        }
        if(language === 'english') {
            this.leftmenuData.editDetails='Edit Details';
            this.leftmenuData.Catelogs='Catelogs';
            this.leftmenuData.orderInformation='ORDER INFORMATION';
            this.leftmenuData.myOrders='My Orders';
            this.leftmenuData.shippingAddress='Shipping Address';
            this.leftmenuData.qa='Q & A';
            this.leftmenuData.accountPrivacy='ACCOUNT & PRIVACY';
            this.leftmenuData.profile='Profile';
            this.leftmenuData.language='Language';
            this.leftmenuData.changePassword='Change Password';
            this.leftmenuData.logout='Logout';
            this.leftmenuData.from='Powered By';
            this.leftmenuData.sbpConsulting='SBP CONSULTING PVT LTD';
            this.leftmenuData.myWishlist='My Wishlist';
        }
        return this.leftmenuData;
    }
}
