interface CategoryLimit {
    category:{
        limit: number
    };
}

const category: CategoryLimit = {
    category: { limit: 20}

}

export const limitedForCategory =()=>{
    return category.category.limit;
}
