import { IAddAddress } from "../../interface/more/addAddress.interface";

export class AddAddressData {
    addAddressData : IAddAddress= {
        selectType: '', home: '',office: '',other: '',country: '',state: '',fullName: '',mobileNumber: '',
        pinCode: '',flatNo: '',area: '',landmark: '',town: '',submit: '',addNewAddress:'',
    };
    getData(language) {
        if(language === 'telugu') {
            this.addAddressData.selectType='రకాన్ని ఎంచుకోండి';
            this.addAddressData.home='హోమ్';
            this.addAddressData.office='ఆఫీస్';
            this.addAddressData.other='ఇతర';
            this.addAddressData.country='దేశాన్ని నమోదు చేయండి';
            this.addAddressData.state='రాష్ట్రము నమోదు చేయండి';
            this.addAddressData.fullName='పూర్తి పేరు';
            this.addAddressData.mobileNumber='మొబైల్ నెంబర్';
            this.addAddressData.pinCode='పిన్ కోడ్';
            this.addAddressData.flatNo='ఇంటి నెంబర్';
            this.addAddressData.area='ఏరియా, కాలనీ, స్ట్రీట్ ';
            this.addAddressData.landmark='ల్యాండ్ మార్క్';
            this.addAddressData.town='టౌన్ ';
            this.addAddressData.submit='సబ్మిట్'; 
            this.addAddressData.addNewAddress='క్రొత్త చిరునామాను జోడించండి';  
                     
        }
        if(language === 'hindi') {
            this.addAddressData.selectType='प्रकार चुनें';
            this.addAddressData.home='घर';
            this.addAddressData.office='कार्यालय';
            this.addAddressData.other='अन्य';
            this.addAddressData.country='देश में प्रवेश करें';
            this.addAddressData.state='राज्य दर्ज करें';
            this.addAddressData.fullName='पूरा नाम';
            this.addAddressData.mobileNumber='मोबाइल नंबर';
            this.addAddressData.pinCode='पिन कोड';
            this.addAddressData.flatNo='घर का नंबर';
            this.addAddressData.area='क्षेत्र';
            this.addAddressData.landmark='सीमा चिन्ह';
            this.addAddressData.town='नगर';
            this.addAddressData.submit='प्रस्तुत';  
            this.addAddressData.addNewAddress='नया पता जोड़ें';  
          
        }
        if(language === 'english') {
            this.addAddressData.selectType='Select Type';
            this.addAddressData.home='home';
            this.addAddressData.office='Office';
            this.addAddressData.other='Other';
            this.addAddressData.country='Country';
            this.addAddressData.state='State';
            this.addAddressData.fullName='Full Name';
            this.addAddressData.mobileNumber='Mobile Number';
            this.addAddressData.pinCode='PinCode';
            this.addAddressData.flatNo='Flat, House No';
            this.addAddressData.area='Area, Colony,Street';
            this.addAddressData.landmark='Landmark e.g. Apollo Hospital';
            this.addAddressData.town='Town/City';
            this.addAddressData.submit='Submit';  
            this.addAddressData.addNewAddress='Add New Address';  
        }
        return this.addAddressData;
    }
}