
import { ISearch } from './../../interface/more/search.interface';
export class SearchData {
    searchData : ISearch= {
        search:'', sortBy: '',featured:'', priceLH: '', priceHL: '', cancel: '',   
    };
    getData(language) {
        if(language === 'telugu') {          
            this.searchData.search = 'సెర్చ్ ';
            this.searchData.sortBy = 'సొర్త్ బై';
            this.searchData.featured = 'ఫీచర్డ్';
            this.searchData.priceLH = 'ధర: తక్కువ నుండి అధికం';
            this.searchData.priceHL = 'ధర: అధిక నుండి తక్కువ';
            this.searchData.cancel = 'క్యాన్సిల్';          
        }
        if(language === 'hindi') {
            this.searchData.search = 'खोज कर';
            this.searchData.sortBy = 'सॉर्ट बी ';
            this.searchData.featured = 'फीचर्ड';
            this.searchData.priceLH = 'कीमतों का उतार - चढ़ाव';
            this.searchData.priceHL = 'मूल्य: उच्च से निम्न';
            this.searchData.cancel = 'रद्द करना';          
        }
        if(language === 'english') {
            this.searchData.search = 'Search';
            this.searchData.sortBy = 'Sort By';
            this.searchData.featured = 'Featured';
            this.searchData.priceLH = 'Price: Low to High';
            this.searchData.priceHL = 'Price: Hign to Low';
            this.searchData.cancel = 'Cancel';           
        }
        return this.searchData;
    }
}