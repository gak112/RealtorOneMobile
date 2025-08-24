import { Routes } from '@angular/router';

export const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  // },

  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'otp',
    loadComponent: () =>
      import('./auth/pages/otp/otp.component').then((m) => m.OtpComponent),
  },
  {
    path: 'tabs/home',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
];
