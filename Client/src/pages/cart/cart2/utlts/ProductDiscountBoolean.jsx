export const ProductDiscount = (product) => {
    console.log(product, 'product')
    if (JSON.parse(localStorage.getItem('couponData'))) {
      const { products, couponEnter } = JSON.parse(
        localStorage.getItem('couponData')
      )
      if (products?.length && couponEnter !== '') {
        return products?.some((item) => item === product?.product?._id)
      }
    }
  }