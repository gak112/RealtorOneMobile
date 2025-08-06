
import { IFAQ } from './../../interface/more/faq.interface';

export class FAQData {
    faqData : IFAQ= {
        faq:''    
    };
    getData(language) {
        if(language === 'telugu') {
            this.faqData.faq='ప్రశ్నలు & సమాధానాలు';
                     
        }
        if(language === 'hindi') {

            this.faqData.faq='सवाल और जवाब';
           
          
        }
        if(language === 'english') {
            this.faqData.faq='Frequently Asked Questions';
            
        }
        return this.faqData;
    }
}