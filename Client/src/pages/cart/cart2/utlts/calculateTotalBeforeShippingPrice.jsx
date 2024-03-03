export const productShippingPrice=(totalPrice,arr1,arr2)=> 
(totalPrice- [...arr1,...arr2].reduce((acc, item) => {
      return (
        acc + item?.product?.shippingPrice * item?.quantity
      )
    }))||0
 