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

import { importProvidersFrom } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';
import { register } from 'swiper/element/bundle';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

register();

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({useSetInputAPI: true}),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    importProvidersFrom(
      AngularFireModule.initializeApp({
        apiKey: 'AIzaSyBcTw99OBpSYCS1ySdSb0IRQ1VgUV52j1s',
        authDomain: 'arharealtorone.firebaseapp.com',
        projectId: 'arharealtorone',
        storageBucket: 'arharealtorone.firebasestorage.app',
        messagingSenderId: '1091476004004',
        appId: '1:1091476004004:web:5670ede2f1b006c0535a31',
        measurementId: 'G-KNQH4T7TRJ',
      }),
      AngularFireFunctionsModule,
      AngularFireAuthModule
    ),
  ],
});
