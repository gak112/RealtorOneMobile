
import { IProfile } from './../../interface/profile/profile.interface';



export class profileData {
    profileData : IProfile= {
        personalInfo: '', edit: '', basicInformation: '', 
        profileEdit: '',
        submit: '',
        enterFirstName: '',
        enterLastName: '',
        enterMobileNumber: '',
    };
    getData(language) {
        if(language === 'telugu') {
            this.profileData.personalInfo='వ్యక్తిగత సమాచారం';
            this.profileData.edit='ఎడిట్';
            this.profileData.basicInformation='ప్రాథమిక సమాచారం';
            this.profileData.profileEdit='ప్రొఫైల్ సవరణ';
            this.profileData.submit='సబ్మిట్';
            this.profileData.enterFirstName='మొదటి పేరును నమోదు చేయండి';
            this.profileData.enterLastName='చివరి పేరును నమోదు చేయండి';
            this.profileData.enterMobileNumber='మొబైల్ నంబర్‌ను నమోదు చేయండి';
                     
        }
        if(language === 'hindi') {
            this.profileData.personalInfo='व्यक्तिगत जानकारी';
            this.profileData.edit='एडिट';
            this.profileData.basicInformation='मूलभूत जानकारी';   
            this.profileData.profileEdit='प्रोफ़ाइल संपादित करें';
            this.profileData.submit='प्रस्तुत';        
            this.profileData.enterFirstName='प्रथम नाम दर्ज करें';
            this.profileData.enterLastName='अंतिम नाम दर्ज करो';
            this.profileData.enterMobileNumber='Mbile नंबर दर्ज करें';
          
        }
        if(language === 'english') {
            this.profileData.personalInfo='Personal Info';
            this.profileData.edit='Edit';
            this.profileData.basicInformation='Basic Information';
            this.profileData.profileEdit='Profile Edit';
            this.profileData.submit='Submit';
            this.profileData.enterFirstName='Enter First Name';
            this.profileData.enterLastName='Enter Last Name';
            this.profileData.enterMobileNumber='Enter Mobile Number';
            
        }
        return this.profileData;
    }
}