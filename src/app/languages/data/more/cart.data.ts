
import { ICart } from './../../interface/more/cart.interface';
export class CartData {
    cartData : ICart= {
        yourCartisEmpty:'', goToShopping: '', deliverTo: '', items:'', proceed: '', cart: '',
        wishlist: '',
        remove: '', yourWishlistisEmpty:''
    };
    getData(language) {
        if(language === 'telugu') {          
            this.cartData.yourCartisEmpty = 'మీ సరుకుల సంచీ ఖాళీగా నున్నది';
            this.cartData.goToShopping = 'గో టు షాపింగ్';
            this.cartData.deliverTo = 'డెలివరీ';
            this.cartData.items = 'ఐటమ్స్';
            this.cartData.proceed = 'ప్రొసీడ్';
            this.cartData.cart = 'కార్ట్ ';
            this.cartData.wishlist = 'విష్ లిస్ట్ ';
            this.cartData.remove = 'తొలగించండి';
            this.cartData.yourWishlistisEmpty = 'మీ విష్ లిస్ట్ ఖాళీగా నున్నది';
        }
        if(language === 'hindi') {
            this.cartData.yourCartisEmpty = 'आपकी गाड़ी खाली है';
            this.cartData.goToShopping = 'खरीदारी के लिए जाएं';
            this.cartData.deliverTo = 'वितरण';
            this.cartData.items = 'आइटम्स';
            this.cartData.proceed = 'प्रोसीड';
            this.cartData.cart = 'कार्ट';
            this.cartData.wishlist = 'इच्छा-सूची';
            this.cartData.remove = 'हटाना';
            this.cartData.yourWishlistisEmpty = 'आपकी इच्छा सूची खाली है';
        }
        if(language === 'english') {
            this.cartData.yourCartisEmpty = 'Your Cart is Empty';
            this.cartData.goToShopping = 'Continue Shopping';
            this.cartData.deliverTo = 'Deliver to';
            this.cartData.items = 'Items';
            this.cartData.proceed = 'Proceed';
            this.cartData.cart = 'Cart';
            this.cartData.wishlist = 'Wishlist';
            this.cartData.remove = 'Remove';
            this.cartData.yourWishlistisEmpty = 'Your Wishlist is Empty';
        }
        return this.cartData;
    }
}