// main.ts
import { importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  PreloadAllModules,
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; // ✅ add compat Firestore
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { register } from 'swiper/element/bundle';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { getStorage, provideStorage } from '@angular/fire/storage';

register();

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({ useSetInputAPI: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),

    importProvidersFrom(
      // ✅ COMPAT init only (do NOT add modular providers like provideFirestore)
      AngularFireModule.initializeApp({
        apiKey: 'AIzaSyBcTw99OBpSYCS1ySdSb0IRQ1VgUV52j1s',
        authDomain: 'arharealtorone.firebaseapp.com',
        projectId: 'arharealtorone',
        // ⬇️ IMPORTANT: use appspot.com here (not firebasestorage.app)
        storageBucket: 'arharealtorone.appspot.com',
        messagingSenderId: '1091476004004',
        appId: '1:1091476004004:web:5670ede2f1b006c0535a31',
        measurementId: 'G-KNQH4T7TRJ',
      }),

      // ✅ compat feature modules
      AngularFirestoreModule,
      AngularFireFunctionsModule,
      AngularFireAuthModule
    ),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyBcTw99OBpSYCS1ySdSb0IRQ1VgUV52j1s',
        authDomain: 'arharealtorone.firebaseapp.com',
        projectId: 'arharealtorone',
        // ⬇️ IMPORTANT: use appspot.com here (not firebasestorage.app)
        storageBucket: 'arharealtorone.appspot.com',
        messagingSenderId: '1091476004004',
        appId: '1:1091476004004:web:5670ede2f1b006c0535a31',
        measurementId: 'G-KNQH4T7TRJ',
      })
    ),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
  ],
}).catch(console.error);
