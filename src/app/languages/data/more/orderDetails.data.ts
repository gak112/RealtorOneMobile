import { IOrderDetails } from './../../interface/more/orderDetails.interface';

export class OrderDetailsData {

    orderDetailsData : IOrderDetails= {
        orderDetails: '', returnOrder: '', clickHere: '', enterreasonForReturn: '', submit: '', returnRemarks: '',
        orderDate: '', orderNo: '', orderTotal: '', downloadInvoice: '', shippingDetails: '',trackOrder: '',
        paymentInformation: '', paymentType: '', billingAddress: '', shippingAddress: '', orderSummary: '',
        itemsCost: '',  deliveryCharges: '',  tax: '',  items:''
    }

    getData(language) {
        if(language === 'telugu') {
          this.orderDetailsData.orderDetails = 'ఆర్డర్ వివరాలు';
          this.orderDetailsData.returnOrder = 'మీరు ఆర్డర్‌ను తిరిగి ఇవ్వాలనుకుంటున్నారా?'; 
          this.orderDetailsData.clickHere = 'క్లిక్ చేయండి '; 
          this.orderDetailsData.enterreasonForReturn = 'రిటర్న్ కి  కారణాలు చెప్పండి  '; 
          this.orderDetailsData.submit = 'సబ్మిట్'; 
          this.orderDetailsData.returnRemarks = 'వ్యాఖ్యలు'; 
          this.orderDetailsData.orderDate = 'ఆర్డర్ తేదీ'; 
          this.orderDetailsData.orderNo = 'ఆర్డర్ నెంబర్ '; 
          this.orderDetailsData.orderTotal = 'ఆర్డర్ మొత్తం'; 
          this.orderDetailsData.downloadInvoice = 'ఇన్వాయిస్ డౌన్లోడ్'; 
          this.orderDetailsData.shippingDetails = 'షిప్పింగ్ అడ్రస్'; 
          this.orderDetailsData.trackOrder = 'ట్రాక్ ఆర్డర్'; 
          this.orderDetailsData.paymentInformation = 'చెల్లింపు సమాచారం'; 
          this.orderDetailsData.paymentType = 'చెల్లించు విధానము'; 
          this.orderDetailsData.billingAddress = 'రశీదు చిరునామా'; 
          this.orderDetailsData.shippingAddress = 'షిప్పింగ్ అడ్రస్'; 
          this.orderDetailsData.orderSummary = 'కొనుగోలు వివరణ'; 
          this.orderDetailsData.itemsCost = 'ఉత్పత్తి ఖర్చు'; 
          this.orderDetailsData.deliveryCharges = 'డెలివరీ ఛార్జీలు'; 
          this.orderDetailsData.tax = 'పన్ను';  
          this.orderDetailsData.items = 'ఐటమ్స్ '; 
                     
        }
        if(language === 'hindi') {

            this.orderDetailsData.orderDetails = 'ऑर्डर का विवरण';
            this.orderDetailsData.returnOrder = 'क्या आप ऑर्डर वापस करना चाहते हैं?'; 
            this.orderDetailsData.clickHere = 'यहां क्लिक करें'; 
            this.orderDetailsData.enterreasonForReturn = 'लौटने का कारण दर्ज करें'; 
            this.orderDetailsData.submit = 'प्रस्तुत'; 
            this.orderDetailsData.returnRemarks = 'वापसी'; 
            this.orderDetailsData.orderDate = 'आदेश की तारीख'; 
            this.orderDetailsData.orderNo = 'आदेश संख्या'; 
            this.orderDetailsData.orderTotal = 'कुल आर्डर'; 
            this.orderDetailsData.downloadInvoice = 'इनवाइस को डाउनलोड करो'; 
            this.orderDetailsData.shippingDetails = 'शिपिंग की जानकारियां'; 
            this.orderDetailsData.trackOrder = 'ऑर्डर पर नज़र रखें'; 
            this.orderDetailsData.paymentInformation = 'भुगतान जानकारी'; 
            this.orderDetailsData.paymentType = 'भुगतान प्रकार'; 
            this.orderDetailsData.billingAddress = 'बिल भेजने का पता'; 
            this.orderDetailsData.shippingAddress = 'शिपिंग पता'; 
            this.orderDetailsData.orderSummary = 'आदेश सारांश'; 
            this.orderDetailsData.itemsCost = 'आइटम लागत'; 
            this.orderDetailsData.deliveryCharges = 'वितरण शुल्क'; 
            this.orderDetailsData.tax = 'कर'; 
            this.orderDetailsData.items = 'आइटम्स';   
          
        }
        if(language === 'english') {
            this.orderDetailsData.orderDetails = 'Order Details';
            this.orderDetailsData.returnOrder = 'Do you want to return the Order ?'; 
            this.orderDetailsData.clickHere = 'Click here'; 
            this.orderDetailsData.enterreasonForReturn = 'Enter reason for returning'; 
            this.orderDetailsData.submit = 'submit'; 
            this.orderDetailsData.returnRemarks = 'Return Remarks'; 
            this.orderDetailsData.orderDate = 'Order Date'; 
            this.orderDetailsData.orderNo = 'Order No'; 
            this.orderDetailsData.orderTotal = 'Order Total'; 
            this.orderDetailsData.downloadInvoice = 'Download Invoice'; 
            this.orderDetailsData.shippingDetails = 'Shipping Details'; 
            this.orderDetailsData.trackOrder = 'Track Order'; 
            this.orderDetailsData.paymentInformation = 'Payment Information'; 
            this.orderDetailsData.paymentType = 'Payment Type'; 
            this.orderDetailsData.billingAddress = 'Billing Address'; 
            this.orderDetailsData.shippingAddress = 'Shipping Address'; 
            this.orderDetailsData.orderSummary = 'Order Summary'; 
            this.orderDetailsData.itemsCost = 'Items Cost'; 
            this.orderDetailsData.deliveryCharges = 'Delivery Charges'; 
            this.orderDetailsData.tax = 'Tax';   
            this.orderDetailsData.items = 'Items'; 
            
        }
        return this.orderDetailsData;
    }
}