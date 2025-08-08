import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },

  {
    path: 'auth',
    loadComponent: () =>
      import('./auth/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
];
