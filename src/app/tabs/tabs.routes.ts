import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../home/pages/homemain/homemain.component').then(
            (m) => m.HomemainComponent
          ),
      },
      {
        path: 'ventures',
        loadComponent: () =>
          import('../ventures/pages/venturemain/venturemain.component').then(
            (m) => m.VenturemainComponent
          ),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('../search/pages/searchmain/searchmain.component').then(
            (m) => m.SearchmainComponent
          ),
      },
      {
        path: 'chat',
        loadComponent: () =>
          import('../chat/pages/personalchat/personalchat.component').then(
            (m) => m.PersonalchatComponent
          ),
      },
      {
        path: 'more',
        loadComponent: () =>
          import('../more/pages/moremain/moremain.component').then(
            (m) => m.MoremainComponent
          ),
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];
