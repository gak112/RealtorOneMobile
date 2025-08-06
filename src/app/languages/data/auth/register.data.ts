
import { IRegister } from './../../interface/auth/register.interface';


export class RegisterData {
    registerData: IRegister = {
        fullName: '', enterFirstName: '', lastName: '', enterLastName: '', mobileNo: '',
        enterMobileNo: '', password: '', enterPassword: '', signUp:'', loading:'', backTo:'',
        login: ''

    };

    getData(language) {
        if(language === 'telugu') {
            this.registerData.fullName = 'మొదటి పేరు';
            this.registerData.enterFirstName = 'మొదటి పేరును నమోదు చేయండి';
            this.registerData.lastName = 'చివరి పేరు';
            this.registerData.enterLastName = 'చివరి పేరును నమోదు చేయండి';
            this.registerData.mobileNo = 'మొబైల్ నెంబర్';
            this.registerData.enterMobileNo = 'మొబైల్ నెంబర్';
            this.registerData.password = 'పాస్‌వర్డ్';
            this.registerData.enterPassword = 'ఎంటర్ పాస్‌వర్డ్';
            this.registerData.signUp = 'సైన్ ఆప్ ';
            this.registerData.loading = 'లోడింగ్';
            this.registerData.backTo = 'బ్యాక్ టు';
            this.registerData.login='లాగిన్';
        }
        if(language === 'hindi') {
            this.registerData.fullName = 'प्रथम नाम';
            this.registerData.enterFirstName = 'प्रथम नाम दर्ज करें';
            this.registerData.lastName = 'अंतिम नाम';
            this.registerData.enterLastName = 'अंतिम नाम दर्ज करो';
            this.registerData.mobileNo = 'मोबाइल नंबर';
            this.registerData.enterMobileNo = 'मोबाइल नंबर दर्ज करें';
            this.registerData.password = 'पारण शब्द';
            this.registerData.enterPassword = 'पास वर्ड दर्ज करें';
            this.registerData.signUp = 'साइन अप करें';
            this.registerData.loading = 'लोड हो रहा है';
            this.registerData.backTo = 'बैक तू';
            this.registerData.login='लॉग इन';
        }
        if(language === 'english') {
            this.registerData.fullName = 'First Name';
            this.registerData.enterFirstName = 'Enter First Name';
            this.registerData.lastName = 'Last Name';
            this.registerData.enterLastName = 'Enter Last Name';
            this.registerData.mobileNo = 'Mobile No';
            this.registerData.enterMobileNo = 'Enter Mobile Number';
            this.registerData.password = 'Password';
            this.registerData.enterPassword = 'Enter Password';
            this.registerData.signUp = 'Sign Up';
            this.registerData.loading = 'Loading';
            this.registerData.backTo = 'Back to';
            this.registerData.login='Login';

        }

        return this.registerData;

    }
}
