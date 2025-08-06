
import { IShop } from './../../interface/more/shop.interface';

export class ShopData {
    shopData : IShop= {
        dealsOftheDay: '', buyXGetY: '', freeGifts: '', categories: '', topRated: '', mostSearched: '', 
        recommended: '', recentlyViewed: '', couponProducts: '', justLaunched: '', yourBrowsingHistory: '', 
    };
    getData(language) {
        if(language === 'telugu') {
           this.shopData.dealsOftheDay = 'డీల్స్ అఫ్ ది డే';
           this.shopData.buyXGetY = '';
           this.shopData.freeGifts = 'ఉచిత బహుమతులు';
           this.shopData.categories = 'కేటగిరీలు';
           this.shopData.topRated = 'టాప్ రేట్';
           this.shopData.mostSearched = 'ఎక్కువగా శోధించారు';
           this.shopData.recommended = 'రికమెండ్';
           this.shopData.recentlyViewed = 'రీసెంట్ వ్యూఎడ్';
           this.shopData.couponProducts = 'కూపన్ ఉత్పత్తులు';
           this.shopData.justLaunched = 'జస్ట్ లాంచ్';
           this.shopData.yourBrowsingHistory = 'మీ  బ్రౌసింగ్ హిస్టరీ';          
                     
        }
        if(language === 'hindi') {
            this.shopData.dealsOftheDay = 'दिन के सौदे';
            this.shopData.buyXGetY = 'एक्स खरीदें वाई प्राप्त करें';
            this.shopData.freeGifts = 'मुफ्त उपहार';
            this.shopData.categories = 'श्रेणियाँ';
            this.shopData.topRated = 'टॉप रेटेड';
            this.shopData.mostSearched = 'सर्वाधिक खोजा गया';
            this.shopData.recommended = 'Recommended';
            this.shopData.recentlyViewed = 'हाल ही में देखा गया';
            this.shopData.couponProducts = 'कूपन का उत्पादन';
            this.shopData.justLaunched = 'अभी प्रक्षेपित हुआ है';
            this.shopData.yourBrowsingHistory = 'आपका ब्राउज़िंग इतिहास';     
          
          
        }
        if(language === 'english') {
            this.shopData.dealsOftheDay = 'Deals of the Day';
            this.shopData.buyXGetY = 'Buy X Get Y';
            this.shopData.freeGifts = 'Free Gifts';
            this.shopData.categories = 'Categories';
            this.shopData.topRated = 'Top Rated';
            this.shopData.mostSearched = 'Most Searched';
            this.shopData.recommended = 'Recommended';
            this.shopData.recentlyViewed = 'Recently viewed';
            this.shopData.couponProducts = 'Coupon Prodducts';
            this.shopData.justLaunched = 'Just Launched';
            this.shopData.yourBrowsingHistory = 'Your Browsing History';     
           
        }
        return this.shopData;
    }
}