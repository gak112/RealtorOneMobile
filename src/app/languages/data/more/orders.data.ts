
import { IFAQ } from './../../interface/more/faq.interface';
import { IOrders } from './../../interface/more/orders.interface';

export class OrdersData {
    ordersData : IOrders= {
        myOrders: '',   track: '',   orderId: '',   items: '',   estimatedDelivery: '',   viewOrderDetails: '',
        placedOn:'',
     };
    getData(language) {
        if(language === 'telugu') {
            this.ordersData.myOrders = 'మై ఆర్డర్స్';
            this.ordersData.track = 'ట్రాక్';
            this.ordersData.orderId = 'ఆర్డర్ ఐడి';
            this.ordersData.items = 'ఐటమ్స్ ';
            this.ordersData.estimatedDelivery = 'ఎస్టిమేట్డ్ డెలివరీ';
            this.ordersData.viewOrderDetails = 'ఆర్డర్ వివరాలను చూడండి';
            this.ordersData.placedOn = 'ప్లేసెడ్';
                     
        }
        if(language === 'hindi') {

            this.ordersData.myOrders = 'मेरे आदेश';
            this.ordersData.track = 'धावन पथ';
            this.ordersData.orderId = 'आर्डर ीडी ';
            this.ordersData.items = 'आइटम';
            this.ordersData.estimatedDelivery = 'अनुमानित डिलिवरी';
            this.ordersData.viewOrderDetails = 'आदेश को विस्तार से देखें';
            this.ordersData.placedOn = 'प्लासेड';
          
        }
        if(language === 'english') {
          this.ordersData.myOrders = 'My Orders';
          this.ordersData.track = 'Track';
          this.ordersData.orderId = 'Order Id';
          this.ordersData.items = 'Items';
          this.ordersData.estimatedDelivery = 'Estimated Delivery';
          this.ordersData.viewOrderDetails = 'View Order Details';
          this.ordersData.placedOn = 'Placed On';
            
        }
        return this.ordersData;
    }
}