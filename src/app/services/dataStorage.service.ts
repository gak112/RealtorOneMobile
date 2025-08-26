import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  private _language = signal<string>('english');

  get language() {
    return this._language();
  }

  set language(lang: string) {
    this._language.set(lang);
    localStorage.setItem('language', lang);
  }

  constructor() {
    // Load language from localStorage on initialization
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      this._language.set(savedLanguage);
    }
  }
}
