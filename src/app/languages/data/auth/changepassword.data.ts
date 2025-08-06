
import { IChangePassword } from './../../interface/auth/changepassword.interface';

export class ChangePasswordData {
    changePasswordData : IChangePassword = {
        oldPassword: '', enterOldPassword: '', newPassword: '', enterNewPassword: '', confirmPassword: '', 
        enterConfirmPassword: '', submit: '', loading: '', back: '', 
        oldpassisreq: '',
        newpassisreq: '',
        confirmpassisreq: '',
    }

    getData(language: string) {
        if(language === 'telugu') {
            this.changePasswordData.oldPassword='ఓల్డ్ పాస్‌వర్డ్';
            this.changePasswordData.enterOldPassword='ఎంటర్ పాస్‌వర్డ్';
            this.changePasswordData.newPassword='న్యూ పాస్‌వర్డ్';
            this.changePasswordData.enterNewPassword='ఎంటర్ పాస్‌వర్డ్';
            this.changePasswordData.confirmPassword='కంఫర్మ్ పాస్‌వర్డ్';
            this.changePasswordData.enterConfirmPassword='ఎంటర్ పాస్‌వర్డ్';
            this.changePasswordData.submit='సబ్మిట్';
            this.changePasswordData.loading='లోడింగ్';
            this.changePasswordData.back='బ్యాక్';  
            this.changePasswordData.oldpassisreq='పాత పాస్‌వర్డ్ నిర్ధారించండి';
            this.changePasswordData.newpassisreq='క్రొత్త పాస్‌వర్డ్ నిర్ధారించండి';
            this.changePasswordData.confirmpassisreq='పాస్‌వర్డ్ నిర్ధారించండి';         
        }
        if(language === 'hindi') {
            this.changePasswordData.oldPassword='पुराना पासवर्ड';
            this.changePasswordData.enterOldPassword='पास वर्ड दर्ज करें';
            this.changePasswordData.newPassword='नया पासवर्ड';
            this.changePasswordData.enterNewPassword='पास वर्ड दर्ज करें';
            this.changePasswordData.confirmPassword='पासवर्ड की पुष्टि कीजिये';
            this.changePasswordData.enterConfirmPassword='पास वर्ड दर्ज करें';
            this.changePasswordData.submit='प्रस्तुत';
            this.changePasswordData.loading='लोडिंग';
            this.changePasswordData.back='बैक';         
            this.changePasswordData.oldpassisreq='पुराना पासवर्ड आवश्यक है';
            this.changePasswordData.newpassisreq='नया पासवर्ड आवश्यक है';
            this.changePasswordData.confirmpassisreq='पासवर्ड की आवश्यकता है';     
        }
        if(language === 'english') {
            this.changePasswordData.oldPassword='Old Password';
            this.changePasswordData.enterOldPassword='Enter Password';
            this.changePasswordData.newPassword='New Password';
            this.changePasswordData.enterNewPassword='Enter Password';
            this.changePasswordData.confirmPassword='Confirm Password';
            this.changePasswordData.enterConfirmPassword='Enter Password';
            this.changePasswordData.submit='Submit';
            this.changePasswordData.loading='Loading';
            this.changePasswordData.back='Back';  
            this.changePasswordData.oldpassisreq='Old Password is required';
            this.changePasswordData.newpassisreq='New Password is required';
            this.changePasswordData.confirmpassisreq='Confirm Password is required';            
        }
        return this.changePasswordData;

    }
}