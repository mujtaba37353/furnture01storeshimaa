import { calculateProductsAfterDiscountForItems } from "./calculateProductsAfterDiscountForSpecificArray";

export const calculateShippingPrice = (couponData) => {
    const { couponEnter, persentage, products } = couponData;


    
    return (totalPrice, arr1, arr2, WithShipping) => {
        const AfterShipping = totalPrice - [...arr1, ...arr2].reduce((acc, item) => {
            return acc + (item?.product?.shippingPrice * item?.quantity|| 0) ;
        }, 0);
        if (WithShipping) {

            if (couponEnter !== "" && products?.length) {

              return  calculateProductsAfterDiscountForItems(
                    [...arr1, ...arr2],
                    products,
                    persentage,
                    (total => {
                        return total 
                    }) )
            } else {
                return AfterShipping
            }
        } else {

            return [...arr1, ...arr2].reduce((acc, item) => {
                return acc + (item?.product?.shippingPrice || 0) * item?.quantity;
            }, 0);
        }
    };

}