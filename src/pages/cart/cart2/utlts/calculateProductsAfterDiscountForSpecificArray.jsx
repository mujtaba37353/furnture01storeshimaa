export  const calculateProductsAfterDiscountForItems = (
    productsArray,
     products,
     percent,
     callback
   ) => {
    let totalItemsCart = 0;

      if(productsArray?.length){
  const arr = productsArray?.map((item) => {
       const { total,product:{finalPrice},totalWithoutShipping
      } = item
       const itemAfterCoupon = (percent / 100) * totalWithoutShipping
       const isDiscount = products?.includes(item.product._id)
       if (isDiscount)
         return { ...item, total: Math?.abs(totalWithoutShipping - itemAfterCoupon) }
       return item
     })
    
     totalItemsCart = arr?.reduce(
       (acc, item) => item?.total + acc,
       0
     )
      }
    
     return callback(totalItemsCart)
   }