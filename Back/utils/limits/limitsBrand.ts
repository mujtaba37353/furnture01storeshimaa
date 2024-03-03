interface BrandLimit {
    brand:{
        limit: number
    };
}

const brand: BrandLimit = {
    brand: { limit: 50}

}

export const limitedForBrand =()=>{
    return brand.brand.limit;
}
