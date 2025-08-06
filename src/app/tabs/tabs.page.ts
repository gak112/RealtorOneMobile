import {
  Component,
  EnvironmentInjector,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  AnimationController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  triangle,
  ellipse,
  square,
  homeOutline,
  home,
  business,
  businessOutline,
  chatbubbleEllipses,
  chatbubbleEllipsesOutline,
  ellipsisVertical,
  ellipsisVerticalOutline,
  search,
  searchOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  homeIcon = viewChild<IonIcon>('homeIcon');
  venturesIcon = viewChild<IonIcon>('venturesIcon');
  searchIcon = viewChild<IonIcon>('searchIcon');
  chatIcon = viewChild<IonIcon>('chatIcon');
  moreIcon = viewChild<IonIcon>('moreIcon');

  public environmentInjector = inject(EnvironmentInjector);
  private animationCtrl = inject(AnimationController);

  selectedTab = signal<ZuriTab>('home');
  constructor() {
    addIcons({
      homeOutline,
      home,
      business,
      businessOutline,
      chatbubbleEllipses,
      chatbubbleEllipsesOutline,
      ellipsisVertical,
      ellipsisVerticalOutline,
      search,
      searchOutline,
    });
  }

  async tabClick(event: MouseEvent, tab: ZuriTab) {
    event.preventDefault();
    await Haptics.impact({ style: ImpactStyle.Medium });
    switch (tab) {
      case 'home':
        this.startAnimation(this.homeIcon()?.['el'] ?? null);
        break;
      case 'ventures':
        this.startAnimation(this.venturesIcon()?.['el'] ?? null);
        break;
      case 'search':
        this.startAnimation(this.searchIcon()?.['el'] ?? null);
        break;
      case 'chat':
        this.startAnimation(this.chatIcon()?.['el'] ?? null);
        break;
      case 'more':
        this.startAnimation(this.moreIcon()?.['el'] ?? null);
        break;
    }
  }

  tabsChange(arg0: string) {
    this.selectedTab.set(arg0 as ZuriTab);
  }

  startAnimation(element: HTMLElement | null) {
    console.log('element', element);
    if (!element) return;
    const iconAnimation = this.animationCtrl
      .create()
      .addElement(element)
      .duration(500)
      .easing('ease-in-out')
      .fromTo('transform', 'scale(1.7)', 'scale(1)');
    iconAnimation.play();
  }
}

export type ZuriTab = (typeof tabList)[number];

const tabList = ['home', 'ventures', 'search', 'chat', 'more'] as const;
