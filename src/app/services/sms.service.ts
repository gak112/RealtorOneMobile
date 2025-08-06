
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class SMSService {
  // twilioCredentials = {
  //   token: '6de0c550f8dcda7bb10b6b5641f7d6a7',
  //   sid: 'AC6f5a4f7075f52b2ba52b124d38b19259',
  // };

  // baseURL =
  //   'https://us-central1-vysyavaaradhi-d31a8.cloudfunctions.net/sendVyvaSMS?';
  // interBaseURL = `https://smsapi.24x7sms.com/api_2.0/SendUnicodeSMS.aspx?APIKEY=kWmOCLMuVcg&`;

  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Access-Control-Allow-Origin': '*',
  //   }),
  // };
  status;
  // private http: HttpClient,
  constructor( private afs: AngularFirestore) {}






  // sendSingleMessage(message: string): Promise<any> {



  //   const headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*');

  //   const path = `http://alerts.smssolutions.in/api/v4/?api_key=A38b0dcd3e1cdea78222cbde81ec6ed31&method=sms.json&json=${message}`;

  //   return this.http.post<any>(path, null).toPromise();
  // }

  processSMS(message: string, phone: string): any {
    const phones = phone.split('-');

    const countryCode = phones[0];
    const phoneNumber = phones[1];

    if (countryCode === '91') {
      phone = `${phoneNumber}`;
      return this.sendSMS(message, phone, 'smsRequest');
    } else {
      phone = `${countryCode}${phoneNumber}`;
      return this.sendSMS(message, phone, 'internationalSMSRequest');
    }
  }

  processOTPSMS(otp: string, phone: string): any {
   // const phones = phone.split('-');

  //  const countryCode = phones[0];
  //  const phoneNumber = phones[1];

  //  if (countryCode === '91') {
     // phone = `${phoneNumber}`;
      return this.sendotpSMS(otp, phone, 'smsOTP');
    // } else {
    //   phone = `${countryCode}${phoneNumber}`;
    //   return this.sendInternationalSMS(otp, phone, 'internationalSMSRequest');
    // }
  }

  processInternationalSMS(phone, message){
    return this.afs
    .collection('internationalSMSRequest')
    .add({ message, to: phone, createdAt: new Date(), status });
  }

  processPassSMS(pass: string, phone: string): any {
      return this.sendPassSMS(pass, phone, 'smsRequest');
  }
  sendotpSMS(otp, phone, status) {
    return this.afs
    .collection('smsOTP')
    .add({ otp, to: phone, createdAt: new Date(), status });
  }

  sendPassSMS(pass, phone, status) {
    return this.afs
    .collection('smsPass')
    .add({ pass, to: phone, createdAt: new Date(), status });
  }

  sendSMS(message, phone, table): any {
    return this.afs
      .collection(table)
      .add({ message, to: phone, createdAt: new Date() });
  }

  // sendMultipleWithSameMessage(): void {}

  // sendMultipleWithDifferentMessage(): void {}

  // getStatus(): void {}

  // sendInternationalSMS(message, phone): any {
  //   //  const headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*');
  //   const url = `${this.interBaseURL}MobileNo=${phone}
  //         &SenderID=JANANESTAM&Message=${message}&ServiceName=INTERNATIONAL`;

  //   return this.http.post<any>(url, null).toPromise();
  // }
}
