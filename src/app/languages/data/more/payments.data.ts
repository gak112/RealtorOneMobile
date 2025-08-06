import { IPayments } from '../../interface/more/payments.interface';



export class PaymentsData {
    profileData: IPayments = {
        payments: '',
        dismiss: '',
        starts: '',
        ends: '',
       };
    getData(language) {
        if(language === 'telugu') {
            this.profileData.payments = 'చెల్లింపులు';
            this.profileData.dismiss='డిస్మిస్';
            this.profileData.starts = 'స్టార్ట్';
            this.profileData.ends = 'ఎండ్';

        }

        if(language === 'english') {
            this.profileData.payments = 'Payments';
            this.profileData.dismiss='Dismiss';
            this.profileData.starts = 'Starts';
            this.profileData.ends = 'Ends';
        }

        if(language === 'hindi') {
            this.profileData.payments = 'भुगतान';
            this.profileData.dismiss='ख़ारिज';
            this.profileData.starts = 'प्रारंभ होगा';
            this.profileData.ends = 'समाप्त होता है';
        }
        return this.profileData;
    }

}
