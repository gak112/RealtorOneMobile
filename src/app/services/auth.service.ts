
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { map, switchMap, take } from 'rxjs/operators';
import { firstValueFrom, Observable, of } from 'rxjs';
import firebase from 'firebase/compat/app';
import { ToastService } from './toast.service';

import { EncrDecrService } from './EncrDecr.service';
import { IUser } from '../auth/models/user.model';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // user$!: Observable<any>;
  // currentuid: any;
  // constructor(
  //   private afAuth: AngularFireAuth,
  //   private afs: AngularFirestore,
  //   private router: Router,
  //   private toast: ToastService,
  //   private ende: EncrDecrService
  // ) {
  //   try {
  //     this.user$ = this.afAuth.authState.pipe(
  //       switchMap((user) => {
  //         if (user) {
  //           return this.afs.doc<any>(`users/${user.uid}`).valueChanges();

  //         } else {
  //           return of(null);
  //         }
  //       })
  //     );
  //   } catch (err) {
  //   }
  // }

  // uid(): any {
  //   return this.user$
  //     .pipe(
  //       take(1),
  //       map((u) => u && u.uid)
  //     )
  //     .toPromise();
  // }

  // getCurrentUser(): any {
  //   return this.user$.pipe(take(1));
  // }

  // login(email: string, password: string) {
  //   // password = this.ende.set('112411919112', password);
  //   return this.afAuth.signInWithEmailAndPassword(email, password);
  // }

  // //   async signIn(email: string, password: string): Promise<string> {

  // //   password = this.ende.set('112411919112', password);

  // //   return await this.afAuth
  // //     .signInWithEmailAndPassword(email, password)
  // //     .then((data) => {
  // //       this.router.navigateByUrl('/tabs/home');
  // //       return 'success';
  // //     })
  // //     .catch((err) =>
  // //        err.message
  // //       //  this.alertnLoading.showAlert(err, 'Login',  '');
  // //     );
  // // }

  // async logout(): Promise<any> {
  //   await this.afAuth.signOut();
  //   return this.router.navigate(['/auth']);
  // }

  // async register(email: string, password: string): Promise<any> {
  //   return await this.afAuth.createUserWithEmailAndPassword(email, password);
  // }

  // async sendResetLink(email: string): Promise<any> {
  //   return await this.afAuth.sendPasswordResetEmail(email);
  // }
  // async changePassword(newpassword: string) {

  //   return firebase.auth().currentUser.updatePassword(newpassword);

  //   //  return firebase.currentUser.updatePassword(newpassword);


  //   //   const user: any = this.afAuth.currentUser;
  //   //  return user.updatePassword(newpassword);

  // }

  // // async googleAuth() {
  // //    return await this.authLogin(new auth.GoogleAuthProvider()).then((res: any) => {

  // //     this.router.navigateByUrl('/');
  // //   });

  // // }

  // // async facebookAuth() {
  // //   return await this.authLogin(new auth.FacebookAuthProvider()).then((res: any) => {
  // //     this.setUserData(res.user);
  // //     this.router.navigateByUrl('/');
  // //   });
  // // }

  // // async authLogin(provider: any) {
  // //   return await this.afAuth.signInWithPopup(provider).then((result) => {
  // //     // this.router.navigateByUrl('/');

  // //     this.setUserData(result.user);
  // //   })
  // //   .catch((error)=> {
  // //     window.alert(error);
  // //   });
  // // }


  // // async setUserData(user: any) {
  // //   const userRef: AngularFirestoreDocument<any> = this.afs.doc(
  // //     `users/${user.uid}`
  // //   );

  // //   const userExist = await firstValueFrom(this.afs.doc(`users/${user.uid}`).valueChanges());

  // //   if (userExist) {


  // //     const updatedUser = {
  // //       uid: user.multiFactor.user.uid,
  // //       fullName: user.multiFactor.user.displayName,
  // //       phone: user.multiFactor.user.phoneNumber,
  // //       loginEmail: user.loginEmail|| '',
  // //       email: user.multiFactor.user.email|| '',
  // //       photoURL: user.multiFactor.user.photoURL,
  // //       loggedAt: new Date()
  // //     };

  // //     this.afs.doc(`users/${updatedUser.uid}`).update(updatedUser).then(success => {
  // //       this.toast.showMessage('Successfully Registered..');
  // //       this.router.navigateByUrl('/');
  // //     });

  // //   } else {


  // //     const userData: IUser =
  // //     {

  // //       uid: user.multiFactor.user.uid,
  // //       fullName: user.multiFactor.user.displayName,
  // //       address: string;
  // //       city: string;
  // //       pincode: string;
  // //       state: string;
  // //       district: string;
  // //       lCountry: string;
  // //       phone: string;
  // //       loginEmail: string;
  // //       email: string;
  // //       photoURL: string;
  // //       secureData: string;
  // //       createdAt: any;
  // //       active: boolean;


  // //       uid: user.multiFactor.user.uid,
  // //       fullName: user.multiFactor.user.displayName,
  // //       phone: user.multiFactor.user.phoneNumber,
  // //       loginEmail: user.loginEmail|| '',
  // //       email: user.multiFactor.user.email|| '',
  // //       photoURL: user.multiFactor.user.photoURL,
  // //       secureData: user.secureData|| '',
  // //       city: user.city|| '',
  // //       district: user.district|| '',
  // //       address: user.address|| '',
  // //       state: user.state|| '',
  // //       pincode: user.pincode|| '',
  // //       active: true,
  // //       createdAt: new Date(),
  // //       lCountry: '',
  // //       geolocationForm: false,
  // //       bankForm: false,
  // //       qrCodeForm: false,
  // //       companyName: '',
  // //       gstNo: '',
  // //       designation: '',
  // //       description: '',
  // //       logo: '',
  // //       profileCompletion: 0,
  // //       instantDelivery: false,
  // //       pinCodes: [],
  // //       contactNo1: '',
  // //       contactNo2: '',
  // //       contactName: '',
  // //       qrCode: '',
  // //       storeCode: '',
  // //       accountNo: '',
  // //       bankName: '',
  // //       ifscCode: '',
  // //       branchName: '',
  // //       phonepeId: '',
  // //       phonepeCode: '',
  // //       gPayId: '',
  // //       gpayCode: '',
  // //       language: '',
  // //       createdAtOrder: 0,
  // //       facebookLink: null,
  // //       instagramLink: null,
  // //       twitterLink: null,
  // //       facebookID: null,
  // //       instagramID: null,
  // //       twitterID: null,
  // //       type:'seller',
  // //       categories: [],
  // //     };

  // //     this.afs.doc(`users/${userData.uid}`).set(userData).then(success => {
  // //       this.toast.showMessage('Successfully Registered..');
  // //       this.router.navigateByUrl('/');
  // //     });

  // //   }


  // //   // return userRef.set(userData, {
  // //   //   merge: true,
  // //   // });
  // // }



  // async verifyPhone(phoneNumber: string) {

  //   const isExistDocs = await firstValueFrom(this.afs.collection('users', ref => ref.where('loginEmail', '==', phoneNumber)).valueChanges());


  //   if (isExistDocs.length > 0) {
  //     const userData = isExistDocs[0];
  //     return userData;

  //   } else {
  //     return false;
  //   }




  // }
}
