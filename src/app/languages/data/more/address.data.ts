

import { IAddress } from './../../interface/more/address.interface';

export class AddressData {
    addressData : IAddress= {
        savedAddress: '', select: '', mobileNo: '', addNewAddress: '', remove: '',
        pleaseLogin: '', loginText: '', login: '', 
    };
    getData(language) {
        if(language === 'telugu') {
            this.addressData.savedAddress='సేవ్ చేసిన చిరునామా';
            this.addressData.select='ఎంచుకోండి';
            this.addressData.mobileNo='మొబైల్ నెంబర్';
            this.addressData.addNewAddress='క్రొత్త చిరునామాను జోడించండి';
            this.addressData.remove='తొలగించండి';
            this.addressData.pleaseLogin='దయచేసి లాగిన్ అవ్వండి';
            this.addressData.loginText='మీరు ఇంతకు ముందు జోడించిన చిరునామాను చూడటానికి లాగిన్ అవ్వండి';
            this.addressData.login='లాగిన్';
                     
        }
        if(language === 'hindi') {
            this.addressData.savedAddress='सहेजा गया पता';
            this.addressData.select='चुनते हैं';
            this.addressData.mobileNo='मोबाइल नंबर';
            this.addressData.addNewAddress='नया पता जोड़ें';
            this.addressData.remove='हटाना';
            this.addressData.pleaseLogin='कृपया लॉगिन करें';
            this.addressData.loginText='आपके द्वारा पहले जोड़े गए पते को देखने के लिए लॉगिन करें';
            this.addressData.login='लॉग इन करें';
          
        }
        if(language === 'english') {
            this.addressData.savedAddress='Saved Address';
            this.addressData.select='Select';
            this.addressData.mobileNo='Mobile No';
            this.addressData.addNewAddress='Add New Address';
            this.addressData.remove='Remove';
            this.addressData.pleaseLogin='please Login..';
            this.addressData.loginText='Login to see address you added previously';
            this.addressData.login='Login';
            
        }
        return this.addressData;
    }
}