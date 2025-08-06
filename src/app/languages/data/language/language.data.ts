
import { ILanguage } from './../../interface/language/language.interface';



export class LanguageSettingsData {
    LanguageData : ILanguage= {
        languageSettings:''    
    };
    getData(language) {
        if(language === 'telugu') {
            this.LanguageData.languageSettings='భాష సెట్టింగులు';
                     
        }
        if(language === 'hindi') {

            this.LanguageData.languageSettings='भाषा सेटिंग';
           
          
        }
        if(language === 'english') {
            this.LanguageData.languageSettings='Language Settings';
            
        }
        return this.LanguageData;
    }
}