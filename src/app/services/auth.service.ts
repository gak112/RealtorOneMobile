import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { IUser } from '../auth/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private afAuth = inject(AngularFireAuth);
  private afs = inject(AngularFirestore);
  private router = inject(Router);

  user$ = this.afAuth.authState.pipe(
    switchMap((user) =>
      user ? this.afs.doc<IUser>(`users/${user.uid}`).valueChanges() : of(null)
    ),
    catchError((error) => {
      console.error('Error fetching user data:', error);
      return of(null);
    }),

    shareReplay(1)
  );

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async logout() {
    await this.afAuth.signOut();
    await this.router.navigateByUrl('/auth');
  }

  async register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  async deleteUser() {
    return this.afAuth.currentUser
      .then((user) => {
        if (user) {
          return user.delete();
        } else {
          throw new Error('No user is currently signed in.');
        }
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
        throw error;
      });
  }
}
