import { IForgotPassword } from "../../interface/auth/forgotpassword.interface";


export class ForgotPasswordData {
   forGotPasswordData : IForgotPassword = {      
        mobileNo: '', enterMobileNumber: '',     submit: '', loading: '', backTo: '', login: '',  
        
    }
        getData(language) {
        if(language === 'telugu') {
            this.forGotPasswordData.mobileNo='మొబైల్ నెంబర్';
            this.forGotPasswordData.enterMobileNumber='మొబైల్ నంబర్‌ను నమోదు చేయండి';         
            this.forGotPasswordData.submit='సబ్మిట్';
            this.forGotPasswordData.loading='లోడింగ్';
            this.forGotPasswordData.backTo='బ్యాక్';
        }
        if(language === 'hindi') {
            this.forGotPasswordData.mobileNo='मोबाइल नंबर';
            this.forGotPasswordData.enterMobileNumber='मोबाइल नंबर दर्ज करें';
            this.forGotPasswordData.submit='प्रस्तुत';
            this.forGotPasswordData.loading='लोडिंग';
            this.forGotPasswordData.backTo='बैक'; 
        }
        if(language === 'english') {
            this.forGotPasswordData.mobileNo='Mobile Number';
            this.forGotPasswordData.enterMobileNumber='Enter Mobile Number';          
            this.forGotPasswordData.submit='Submit';
            this.forGotPasswordData.loading='Loading';
            this.forGotPasswordData.backTo='Back';           
        }
        return this.forGotPasswordData;

    }
}