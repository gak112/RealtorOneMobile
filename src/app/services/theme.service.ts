import {
  effect,
  inject,
  Injectable,
  Injector,
  signal,
  DOCUMENT,
} from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private injector = inject(Injector);

  #theme = signal<'dark' | 'light' | null>(null);
  theme = this.#theme.asReadonly();

  setTheme(theme?: 'dark' | 'light') {
    if (theme) {
      this.#theme.set(theme);
      return;
    }
    this.theme() === 'dark'
      ? this.#theme.set('light')
      : this.#theme.set('dark');
  }

  async initTheme() {
    await Preferences.configure({ group: 'NativeStorage' });
    const { value: theme } = await Preferences.get({ key: 'appTheme' });
    this.document.body.setAttribute('color-theme', theme || 'light');
    this.setTheme((theme as 'dark' | 'light') || 'light');
    effect(
      async () => {
        this.document.body.setAttribute('color-theme', this.theme() ?? 'light');
        await Preferences.set({
          key: 'appTheme',
          value: this.theme() ?? 'light',
        });
      },
      {
        injector: this.injector,
      }
    );
  }
}
