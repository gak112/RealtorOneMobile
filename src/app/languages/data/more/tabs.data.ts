
import { ITabs } from './../../interface/more/tabs.interface';

export class TabsData {
    tabsData : ITabs= {
        shop: '', search: '', cart: '', more: '', 
    };
    getData(language) {
        if(language === 'telugu') {
            this.tabsData.shop='షాప్';
            this.tabsData.search='సెర్చ్';
            this.tabsData.cart='కార్ట్';
            this.tabsData.more='మోర్';
                     
        }
        if(language === 'hindi') {

            this.tabsData.shop='शॉप';
            this.tabsData.search='सर्च';
            this.tabsData.cart='कार्ट';
            this.tabsData.more='मोरे';
           
          
        }
        if(language === 'english') {

            this.tabsData.shop='Shop';
            this.tabsData.search='Search';
            this.tabsData.cart='Cart';
            this.tabsData.more='More';
            
        }
        return this.tabsData;
    }
}