
import { ITrack } from './../../interface/more/track.interface';

export class TrackData {
    trackData : ITrack= {
        trackOrder: '', orderId: '',items: '',total: '',estimatedDeliveryon: '',orderPlaced: '',orderPacked: '',outForDelivery: '',delivered: '',
        deliveryAddress: '',
        orderShipped: '',
        orderprocessing: '',
        sellerpacked: '',
        sellerhanded: '',  
        courierisout: '',
        itemdelivered: '',
        rateproduct: '',
     };
    getData(language) {
        if(language === 'telugu') {
           
          
            this.trackData.trackOrder = 'ట్రాక్ ఆర్డర్';
            this.trackData.orderId = 'ఆర్డర్ ఐడి';
            this.trackData.items = 'ఐటమ్స్ ';
            this.trackData.total = 'మొత్తం';
            this.trackData.estimatedDeliveryon = 'అంచనా డెలివరీ';
            this.trackData.orderPlaced = 'ఆర్డర్ ప్లాసిడ్';
            this.trackData.orderPacked = 'ఆర్డర్ ప్యాక్ చేయబడింది';
            this.trackData.outForDelivery = 'అవుట్ ఫర్ డెలివరీ';         
            this.trackData.delivered = 'పంపిణీ చేయబడింది';
            this.trackData.deliveryAddress = 'పంపాల్సిన చిరునామా';
            this.trackData.orderShipped="ఆర్డర్ రవాణా చేయబడింది";
            this.trackData.orderprocessing="ఆర్డర్ ప్రాసెసింగ్ ప్రారంభించబడింది";
            this.trackData.sellerpacked="సెల్లెర్ ఉత్పత్తిని ప్యాక్ చేసాడు";
            this.trackData.sellerhanded="సెల్లెర్ కొరియర్‌కు వస్తువును అందజేశారు";
            this.trackData.courierisout="కొరియర్ అవుట్ ఫర్ డెలివరీ";
            this.trackData.itemdelivered="ఉత్పత్తి విజయవంతంగా పంపిణీ చేయబడింది";
            this.trackData.rateproduct="ఈ ఉత్పత్తిని ఇప్పుడే రేట్ చేయండి";
          
                     
        }
        if(language === 'hindi') {         
            this.trackData.trackOrder = 'ऑर्डर पर नज़र रखें';
            this.trackData.orderId = 'आर्डर ीडी ';
            this.trackData.items = 'आइटम';
            this.trackData.total = 'संपूर्ण';
            this.trackData.estimatedDeliveryon = 'अनुमानित वितरण';
            this.trackData.orderPlaced = 'आदेश रखा';
            this.trackData.orderPacked = 'ऑर्डर पैक किया गया';
            this.trackData.outForDelivery = 'डिलिवरी के लिए रवाना';         
            this.trackData.delivered = 'पहुंचा दिया';
            this.trackData.deliveryAddress = 'डिलिवरी का पता';
            this.trackData.orderShipped="ऑर्डर भेज दिया";
            this.trackData.orderprocessing="आदेश प्रसंस्करण शुरू किया गया है";
            this.trackData.sellerpacked="विक्रेता ने आपका आइटम पैक कर दिया है";
            this.trackData.sellerhanded="विक्रेता ने आइटम को कूरियर को सौंप दिया है";
            this.trackData.courierisout="Courier is out to deliver your order";
            this.trackData.itemdelivered="आइटम सफलतापूर्वक वितरित किया गया है";
            this.trackData.rateproduct="इस उत्पाद को अभी रेट करें";
           
          
        }
        if(language === 'english') {
            this.trackData.trackOrder = 'Track Order';
            this.trackData.orderId = 'Order Id';
            this.trackData.items = 'Items';
            this.trackData.total = 'Total';
            this.trackData.estimatedDeliveryon = 'Estimated Delivery on';
            this.trackData.orderPlaced = 'Order Placed';
            this.trackData.orderPacked = 'Order Packed';
            this.trackData.outForDelivery = 'Out for Delivery';         
            this.trackData.delivered = 'Delivered';
            this.trackData.deliveryAddress = 'Delivery Address';
            this.trackData.orderShipped="Order Shipped";
            this.trackData.orderprocessing="Order processing has been initiated";
            this.trackData.sellerpacked="Seller has packed your item";
            this.trackData.sellerhanded="Seller has handed over the item to courier";
            this.trackData.courierisout="Courier is out to deliver your order";
            this.trackData.itemdelivered="Item has been delivered successfully";
            this.trackData.rateproduct="Rate this product now";
         
            
        }
        return this.trackData;
    }
}