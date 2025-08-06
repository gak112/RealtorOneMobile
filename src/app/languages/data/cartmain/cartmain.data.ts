
import { ICartMain } from './../../interface/cartmain/cartmain.interface';
export class CartMainData {
    cartMainData : ICartMain= {
        viewMore: '',  wantTogetFreeoffer: '',  doyouwanttocontinue: '',  youhaveRejected: '',  wantToProceed: '',
          clickhere: '',  note: '',  deliver: '',  items: '',  proceed: '',   yes: '', no: '',
    }
        getData(language) {
  
        if(language === 'telugu') {    
            this.cartMainData.viewMore = 'మరిన్ని చూడండి'; 
            this.cartMainData.wantTogetFreeoffer = 'మీరు ఉచిత ఆఫర్ పొందాలనుకుంటే మీరు గిఫ్ట్ డిఫాల్ట్ మొత్తాన్ని చెల్లించాలి'; 
            this.cartMainData.doyouwanttocontinue = 'మీరు కొనసాగించాలనుకుంటున్నారా?'; 
            this.cartMainData.youhaveRejected = 'ఉచిత ఆఫర్ పొందడానికి మీరు తిరస్కరించారు'; 
            this.cartMainData.wantToProceed = 'మీరు మళ్ళీ కొనసాగాలనుకుంటే?'; 
            this.cartMainData.clickhere = 'క్లిక్ చేయండి ';      
            this.cartMainData.note = '(గమనిక: కార్ట్  మొత్తానికి గిఫ్ట్ డిఫాల్ట్ మొత్తం జోడించబడింది)'; 
            this.cartMainData.deliver = 'డెలివరీ';
            this.cartMainData.items = 'ఐటమ్స్';
            this.cartMainData.proceed = 'ప్రొసీడ్';
            this.cartMainData.yes = 'అవును',
            this.cartMainData.no = 'కాదు '

          
        }
        if(language === 'hindi') {
            this.cartMainData.viewMore = 'View More'; 
            this.cartMainData.wantTogetFreeoffer = 'अगर आप फ्री ऑफर लेना चाहते हैं तो आपको गिफ्ट डिफॉल्ट राशि का भुगतान करना चाहिए'; 
            this.cartMainData.doyouwanttocontinue = 'क्या आप जारी रखना चाहते हैं ?'; 
            this.cartMainData.youhaveRejected = 'आपने फ्री ऑफर पाने के लिए रिजेक्ट कर दिया है'; 
            this.cartMainData.wantToProceed = 'यदि आप फिर से आगे बढ़ना चाहते हैं?'; 
            this.cartMainData.clickhere = 'यहाँ क्लिक करें';      
            this.cartMainData.note = '(ध्यान दें: यदि आप कार्ट की कुल राशि में गिफ्ट डिफॉल्ट राशि जारी रखते हैं)'; 
            this.cartMainData.deliver = 'वितरण';
            this.cartMainData.items = 'आइटम्स';
            this.cartMainData.proceed = 'प्रोसीड';
            this.cartMainData.yes = 'हाँ',
            this.cartMainData.no = 'नहीं न'
        }
        if(language === 'english') {
            this.cartMainData.viewMore = 'View More'; 
            this.cartMainData.wantTogetFreeoffer = 'If you want to get Free Offer you should pay Gift default amount'; 
            this.cartMainData.doyouwanttocontinue = 'Do you want to continue ?'; 
            this.cartMainData.youhaveRejected = 'You have rejected to get Free Offer'; 
            this.cartMainData.wantToProceed = 'If you want to proceed again?'; 
            this.cartMainData.clickhere = 'Click Here';      
            this.cartMainData.note = '(Note: If you continue Gift default amount added to Cart total amount)'; 
            this.cartMainData.deliver = 'Deliver to'; 
            this.cartMainData.items = 'Items'; 
            this.cartMainData.proceed = 'Proceed'; 
            this.cartMainData.yes = 'Yes',
            this.cartMainData.no = 'No'
        }
        return this.cartMainData;
    }
}