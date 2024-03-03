import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { categoriesApi } from './apis/categoriesApi'
import { ProductsApi } from './apis/ProductApis'
import { savedProductsApi } from './apis/SavedProductApi'
import { userApi } from './apis/UserApis'
import guestUserApi from './apis/gestUserApi'
import cartApi from './apis/cartApi'
import contactsApi from './apis/contactsApis'
import ordersApi from './apis/ordersApi'
import privacyApi from './apis/privacyApi'
import UploadsApi from './apis/UploadsApi'
import { verifiedApi } from './apis/verifiedCodeApi'
import forgetPassApi from './apis/forgetPassApi'
import attributeApi from './apis/attributeApi'
import { subcategoriesApi } from './apis/subcategoriesApi'
import { webhookApi } from './apis/webhookApi'
import { loginGoogleApi } from './apis/loginGoogleApi'
import userSlice from './slices/userSlice'
import savedReducer from './slices/savedSlice'
import cartReducer from './slices/cartSlice'
import refetchReducer from './slices/refetchSlice'
import sectionsApi from './apis/sectionsApi'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { persistStore, persistReducer } from 'redux-persist'
import { CurrencySlice } from './slices/currency/currencySlice.js'
import currencyApi from './apis/currencyApi'
import { NotificationsApi } from './apis/NotificationsApi'
import { blogsApi } from './apis/blogsApi.js'
import PointsApi from './apis/pointsApi.js'
import { CouponApi } from './apis/couponApi.js'
import analyticsMetaApi from './apis/analyticsMeta.js'
import { metaApi } from './apis/meta-front.js'
import commentsApi from './apis/commentApi.js'
import saveditemsSlice from './slices/saveditemsSlice.js'
import bestSellerProductsSlice from './slices/bestSellerProductsSlice.js'
import scrollActivitySlice from './slices/scrollActivitySlice.js'
const persisitConfig = {
  key: 'root',
  storage,
  whitelist: ['currency', 'currentUser'],
}
const RootReducer = combineReducers({
  [attributeApi.reducerPath]: attributeApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [ProductsApi.reducerPath]: ProductsApi.reducer,
  [savedProductsApi.reducerPath]: savedProductsApi.reducer,
  [categoriesApi.reducerPath]: categoriesApi.reducer,
  [guestUserApi.reducerPath]: guestUserApi.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
  [contactsApi.reducerPath]: contactsApi.reducer,
  [ordersApi.reducerPath]: ordersApi.reducer,
  [privacyApi.reducerPath]: privacyApi.reducer,
  [UploadsApi.reducerPath]: UploadsApi.reducer,
  [verifiedApi.reducerPath]: verifiedApi.reducer,
  [forgetPassApi.reducerPath]: forgetPassApi.reducer,
  [subcategoriesApi.reducerPath]: subcategoriesApi.reducer,
  [webhookApi.reducerPath]: webhookApi.reducer,
  [loginGoogleApi.reducerPath]: loginGoogleApi.reducer,
  [sectionsApi.reducerPath]: sectionsApi.reducer,
  [currencyApi.reducerPath]: currencyApi.reducer,
  [NotificationsApi.reducerPath]: NotificationsApi.reducer,
  [blogsApi.reducerPath]: blogsApi.reducer,
  [PointsApi.reducerPath]: PointsApi.reducer,
  [CouponApi.reducerPath]: CouponApi.reducer,
  [analyticsMetaApi.reducerPath]: analyticsMetaApi.reducer,
  [metaApi.reducerPath]: metaApi.reducer,
  [commentsApi.reducerPath]: commentsApi.reducer,

  saved: savedReducer,
  cart: cartReducer,
  refetching: refetchReducer,
  currentUser: userSlice,
  currency: CurrencySlice.reducer,
  savedItems: saveditemsSlice,
  bestSellerProducts: bestSellerProductsSlice,
  scrollActivity: scrollActivitySlice,
})
const persistedReducer = persistReducer(persisitConfig, RootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(
      userApi.middleware,
      ProductsApi.middleware,
      savedProductsApi.middleware,
      categoriesApi.middleware,
      guestUserApi.middleware,
      cartApi.middleware,
      contactsApi.middleware,
      ordersApi.middleware,
      privacyApi.middleware,
      UploadsApi.middleware,
      verifiedApi.middleware,
      forgetPassApi.middleware,
      attributeApi.middleware,
      subcategoriesApi.middleware,
      webhookApi.middleware,
      loginGoogleApi.middleware,
      sectionsApi.middleware,
      currencyApi.middleware,
      NotificationsApi.middleware,
      blogsApi.middleware,
      PointsApi.middleware,
      CouponApi.middleware,
      analyticsMetaApi.middleware,
      metaApi.middleware,
      commentsApi.middleware
    )
  },
})
export const persistor = persistStore(store)
