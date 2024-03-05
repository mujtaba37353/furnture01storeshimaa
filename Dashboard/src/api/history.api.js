import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";

export const historyApi = createApi({
  reducerPath: "historyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["historyApi"],
  endpoints: (builder) => ({
    getAllUserSignUpEachDay: builder.query({
        query: () => ({ url: `history/getUserEachDay` }),
        providesTags: ["historyApi"],
    }),
    getAllGuestUserSignUpEachDay: builder.query({
        query: () => ({ url: `history/getGuestUserEachDay` }),
        providesTags: ["historyApi"],
    }),
    getAllOrdersEachDayAndTotalMoney: builder.query({
        query: () => ({ url: `history/getOrdersEachDayAndTotalMoney` }),
        providesTags: ["historyApi"],
    }),
    getAllOrdersEachMonth: builder.query({
        query: () => ({ url: `history/getOrdersEachMonth` }),
        providesTags: ["historyApi"],
    }),
    getAllStatusDetails: builder.query({
        query: () => ({ url: `history/getAllStatusDetails` }),
        providesTags: ["historyApi"],
    }),
    getAllVisitorsLocation: builder.query({
        query: () => ({ url: `history/getAllVisitorsLocation` }),
        providesTags: ["historyApi"],
    }),
  }),
});

export const {
    useGetAllUserSignUpEachDayQuery,
    useGetAllGuestUserSignUpEachDayQuery,
    useGetAllOrdersEachDayAndTotalMoneyQuery,
    useGetAllOrdersEachMonthQuery,
    useGetAllStatusDetailsQuery,
    useGetAllVisitorsLocationQuery,
} = historyApi;
