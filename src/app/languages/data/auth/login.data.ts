

import { ILogin } from './../../interface/auth/login.interface';

export class LoginData {
    loginData : ILogin = {
        mobileNo: '', enterMobileNumber: '', password: '', enterPassword: '', forgotPassword: '', 
        signIn: '', dontHaveAnAccount: '', loading: '', register:''
      
    }

    getData(language) {
        if(language === 'telugu') {
            this.loginData.mobileNo='మొబైల్ నెంబర్';
            this.loginData.enterMobileNumber='మొబైల్ నంబర్‌ను నమోదు చేయండి';
            this.loginData.password='పాస్‌వర్డ్';
            this.loginData.enterPassword='ఎంటర్ పాస్‌వర్డ్';
            this.loginData.forgotPassword='ఫర్ గెట్ పాస్‌వర్డ్';
            this.loginData.signIn='ఎంటర్ పాస్‌వర్డ్';
            this.loginData.dontHaveAnAccount='మీకు ఖాతా లేదా?';
            this.loginData.loading='లోడింగ్';
            this.loginData.register='నమోదు';           
        }
        if(language === 'hindi') {
            this.loginData.mobileNo='मोबाइल नंबर';
            this.loginData.enterMobileNumber='मोबाइल नंबर दर्ज करें';
            this.loginData.password='पारण शब्द';
            this.loginData.enterPassword='पास वर्ड दर्ज करें';
            this.loginData.forgotPassword='पासवर्ड भूल गए';
            this.loginData.signIn='साइन इन करें';
            this.loginData.dontHaveAnAccount='आप एक खाता नहीं है?';
            this.loginData.loading='लोड हो रहा है';
            this.loginData.register='रजिस्टर करें';  
        }
        if(language === 'english') {
            this.loginData.mobileNo='Mobile No';
            this.loginData.enterMobileNumber='Enter Mobile Number';
            this.loginData.password='Password';
            this.loginData.enterPassword='Enter Password';
            this.loginData.forgotPassword='Forgot Password';
            this.loginData.signIn='Sign In';
            this.loginData.dontHaveAnAccount='Don t have an account ';
            this.loginData.loading='loading';
            this.loginData.register='Register';         
        }

        return this.loginData;

    }
}