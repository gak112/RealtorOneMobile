
import { IProfile } from './../../interface/profile/profile.interface';



export class profileData {
    profileData : IProfile= {
        personalInfo: '', edit: '', basicInformation: '',
        profileEdit: '',
        submit: '',
        enterFirstName: '',
        enterLastName: '',
        enterMobileNumber: '',
        // Additional properties
        YourProfile: '',
        FullName: '',
        mobileNumber: '',
        Email: '',
        DateOfBirth: '',
        Gender: '',
        Male: '',
        Female: '',
        Other: '',
        PreferNotToDisclose: '',
        Verified: '',
        UpdateProfile: '',
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
            // Additional properties
            this.profileData.YourProfile='మీ ప్రొఫైల్';
            this.profileData.FullName='పూర్తి పేరు';
            this.profileData.mobileNumber='మొబైల్ నంబర్';
            this.profileData.Email='ఇమెయిల్';
            this.profileData.DateOfBirth='పుట్టిన తేదీ';
            this.profileData.Gender='లింగం';
            this.profileData.Male='పురుషుడు';
            this.profileData.Female='మహిళ';
            this.profileData.Other='ఇతర';
            this.profileData.PreferNotToDisclose='బహిర్గతం చేయకూడదు';
            this.profileData.Verified='ధృవీకరించబడింది';
            this.profileData.UpdateProfile='ప్రొఫైల్ అప్డేట్ చేయండి';
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
            // Additional properties
            this.profileData.YourProfile='आपकी प्रोफ़ाइल';
            this.profileData.FullName='पूरा नाम';
            this.profileData.mobileNumber='मोबाइल नंबर';
            this.profileData.Email='ईमेल';
            this.profileData.DateOfBirth='जन्म तिथि';
            this.profileData.Gender='लिंग';
            this.profileData.Male='पुरुष';
            this.profileData.Female='महिला';
            this.profileData.Other='अन्य';
            this.profileData.PreferNotToDisclose='प्रकट नहीं करना पसंद करें';
            this.profileData.Verified='सत्यापित';
            this.profileData.UpdateProfile='प्रोफ़ाइल अपडेट करें';
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
            // Additional properties
            this.profileData.YourProfile='Your Profile';
            this.profileData.FullName='Full Name';
            this.profileData.mobileNumber='Mobile Number';
            this.profileData.Email='Email';
            this.profileData.DateOfBirth='Date of Birth';
            this.profileData.Gender='Gender';
            this.profileData.Male='Male';
            this.profileData.Female='Female';
            this.profileData.Other='Other';
            this.profileData.PreferNotToDisclose='Prefer not to disclose';
            this.profileData.Verified='Verified';
            this.profileData.UpdateProfile='Update Profile';
        }
        return this.profileData;
    }
}