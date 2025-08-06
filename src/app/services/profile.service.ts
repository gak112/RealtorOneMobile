import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';



@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    constructor(private afs: AngularFirestore, private auth: AuthService) {}




}
