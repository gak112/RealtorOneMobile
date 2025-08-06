
import { IRating } from './../../interface/more/rating.interface';
export class RatingData {
    ratingData : IRating= {
        rateproduct: '', customerReviews: '', customerRatings: '', star: '', howsatisfiedareyouwiththisProduct: '', youRatedProduct: '', 
       };
    getData(language) {
        if(language === 'telugu') {          
            this.ratingData.rateproduct = 'ఈ ఉత్పత్తిని రేట్ చేయండి';
            this.ratingData.customerReviews = 'కస్టమర్ రివ్యూస్';
            this.ratingData.customerRatings = 'కస్టమర్ రేటింగ్స్';
            this.ratingData.star = 'స్టార్';
            this.ratingData.howsatisfiedareyouwiththisProduct = 'ఈ ఉత్పత్తితో మీరు ఎంత సంతృప్తి చెందారు?';
            this.ratingData.youRatedProduct = 'మీరు ఈ ఉత్పత్తికి రేట్ చేసారు';          
        }
        if(language === 'hindi') {
            this.ratingData.rateproduct = 'इस उत्पाद को रेट करें';
            this.ratingData.customerReviews = 'ग्राहक समीक्षा';
            this.ratingData.customerRatings = 'ग्राहक रेटिंग';
            this.ratingData.star = 'स्टार';
            this.ratingData.howsatisfiedareyouwiththisProduct = 'आप इस उत्पाद से कितने संतुष्ट हैं?';
            this.ratingData.youRatedProduct = 'आपने इस उत्पाद को रेट किया है';   
        }
        if(language === 'english') {
            this.ratingData.rateproduct = 'Rate This Product';
            this.ratingData.customerReviews = 'Customer Reviews';
            this.ratingData.customerRatings = 'Customer Ratings';
            this.ratingData.star = 'Star';
            this.ratingData.howsatisfiedareyouwiththisProduct = 'How satisfied are you with this Product?';
            this.ratingData.youRatedProduct = 'you have rated to this product';              
        }
        return this.ratingData;
    }
}