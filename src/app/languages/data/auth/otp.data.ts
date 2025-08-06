
import { IOTP } from './../../interface/auth/otp.interface';

export class OTPData {
    registerData : IOTP = {
        otpSentToYourRegisteredMobileNumber: '', timeLeft: '',
        seconds: '', submit: '', resendOTP: '', loading: '',
      
    }

    getData(language) {
        if(language === 'telugu') {
            this.registerData.otpSentToYourRegisteredMobileNumber='OTP మీ నమోదిత మొబైల్ నంబర్‌కు పంపబడింది';
            this.registerData.timeLeft='మిగిలిన సమయం';
            this.registerData.seconds='సెకన్లు';
            this.registerData.submit='సబ్మిట్';
            this.registerData.resendOTP='OTP ను మళ్ళీ పంపు';
            this.registerData.loading='లోడింగ్';                  
        }
        if(language === 'hindi') {
            this.registerData.otpSentToYourRegisteredMobileNumber='आपके पंजीकृत मोबाइल नंबर पर OTP भेजा गया';
            this.registerData.timeLeft='सेकंड';
            this.registerData.seconds='सेकंड';
            this.registerData.submit='प्रस्तुत';
            this.registerData.resendOTP='पुन: भेजें OTP';
            this.registerData.loading='लोड हो रहा है';                
        
        }
        if(language === 'english') {
            this.registerData.otpSentToYourRegisteredMobileNumber='OTP sent to your registered mobile number';
            this.registerData.timeLeft='Time left';
            this.registerData.seconds='Seconds';
            this.registerData.submit='Submit';
            this.registerData.resendOTP='Resend OTP';
            this.registerData.loading='Loading';                
        }

        return this.registerData;

    }
}