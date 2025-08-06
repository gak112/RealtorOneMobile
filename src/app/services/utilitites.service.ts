import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;
@Injectable({
    providedIn: 'root'
})
export class UtilitiesService {


   languageUtility: BehaviorSubject<string> = new BehaviorSubject('english');

   themeUtility: BehaviorSubject<string>  = new BehaviorSubject('light');

    constructor() {
    }
  async getLanguage() {

  return (await Storage.get({key: 'language'}) as any).value;
  }

 async changeLanguage(lan) {
   return await Storage.set({key: 'language', value: lan});
  }
}