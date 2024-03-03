import { configureStore } from "@reduxjs/toolkit";
import { attributeApi } from "./attribute.api";
import { authApi } from "./auth.api";
import { categoryApi } from "./category.api";
import { commentApi } from "./comment.api";
import { contactApi } from "./contact.api";
import { historyApi } from "./history.api";
import { orderApi } from "./order.api";
import { productApi } from "./product.api";
import { reviewApi } from "./review.api";
import { sectionApi } from "./section.api";
import { subcategoryApi } from "./subcategories.api";
import { uploadApi } from "./upload.api";
import { userApi } from "./user.api";
import userReducer from "./slice/user.slice";
import { metaApi } from "./meta.api";
import { offersApi } from "./offers.api";
import { couponApi } from "./coupon.api";
import { marketerApi } from "./marketer.api";
import { blogsApi } from "./blogsApi";
import { MessagesApi } from "./Messages";
import { pointsApi } from "./points.api";
import { NotificationsApi } from "./NotificationsApi";
import { toolsApi } from "./toolsApi";
import { pointsMangementApi } from "./pointsMangement";
import { repoApi } from "./repos.api";
import { cartApi } from "./cart.api";
import repoProductsSlice from "./slice/repoProducts.slice";
import { subscriberApi } from "./subscriber.api";
import { subSubCategoriesApi } from "./subSubCategories.api";
import { qualitiesApi } from "./qualities.api";
const createStore = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [attributeApi.reducerPath]: attributeApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [historyApi.reducerPath]: historyApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [sectionApi.reducerPath]: sectionApi.reducer,
    [subcategoryApi.reducerPath]: subcategoryApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [metaApi.reducerPath]: metaApi.reducer,
    [offersApi.reducerPath]: offersApi.reducer,
    [couponApi.reducerPath]: couponApi.reducer,
    [pointsApi.reducerPath]: pointsApi.reducer,
    [marketerApi.reducerPath]: marketerApi.reducer,
    [blogsApi.reducerPath]: blogsApi.reducer,
    [NotificationsApi.reducerPath]: NotificationsApi.reducer,
    [MessagesApi.reducerPath]: MessagesApi.reducer,
    [toolsApi.reducerPath]: toolsApi.reducer,
    [pointsMangementApi.reducerPath]: pointsMangementApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [repoApi.reducerPath]: repoApi.reducer,
    [subscriberApi.reducerPath]: subscriberApi.reducer,
    [subSubCategoriesApi.reducerPath]: subSubCategoriesApi.reducer,
    [qualitiesApi.reducerPath]: qualitiesApi.reducer,

    user: userReducer,
    repoProducts: repoProductsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      attributeApi.middleware,
      categoryApi.middleware,
      commentApi.middleware,
      contactApi.middleware,
      historyApi.middleware,
      orderApi.middleware,
      productApi.middleware,
      reviewApi.middleware,
      sectionApi.middleware,
      subcategoryApi.middleware,
      uploadApi.middleware,
      userApi.middleware,
      metaApi.middleware,
      offersApi.middleware,
      couponApi.middleware,
      blogsApi.middleware,
      pointsApi.middleware,
      marketerApi.middleware,
      NotificationsApi.middleware,
      MessagesApi.middleware,
      pointsMangementApi.middleware,
      toolsApi.middleware,
      cartApi.middleware,
      repoApi.middleware,
      subscriberApi.middleware,
      subSubCategoriesApi.middleware,
      qualitiesApi.middleware
    ),
});

export const store = createStore;
