export const calculateProductsAfterDiscount = (
  arr1,
  arr2,
  products,
  percent,
  callback
) => {

  const after1 = arr1.map((item) => {
    const { total ,product:{finalPrice},totalWithoutShipping} = item;
      const itemAfterCoupon = (percent / 100) * totalWithoutShipping
      console.log(finalPrice,itemAfterCoupon,'total,shippingPrice2')
      const isDiscount = products.includes(item.product._id)
      if (isDiscount){
         return { ...item, total: Math.abs(Math.ceil((total) - (itemAfterCoupon))) }
    }return item
  })
  const after2 = arr2.map((item) => {
    const { total ,product:{finalPrice},totalWithoutShipping} = item;
    const itemAfterCoupon = (percent / 100) * totalWithoutShipping
    const isDiscount = products.includes(item.product._id)
    if (isDiscount){
       return { ...item, total: Math.abs(total - itemAfterCoupon) }
   } return item
  })

  const total = [...after1, ...after2].reduce(
    (acc, item) => item.total + acc,
    0
  )
  return callback(total)
}
