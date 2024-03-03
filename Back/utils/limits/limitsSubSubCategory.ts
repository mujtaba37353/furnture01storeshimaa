interface SubSubCategoryLimit {
    subSubCategory:{
        limit: number
    };
}

const subSubCategory: SubSubCategoryLimit = {
    subSubCategory: { limit: 10}

}

export const limitedForSubSubCategory =()=>{
    return subSubCategory.subSubCategory.limit;
}
