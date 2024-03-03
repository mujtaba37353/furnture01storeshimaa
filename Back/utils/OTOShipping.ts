import axios, { AxiosRequestConfig } from "axios";
import { StatusCodes } from "http-status-codes";
import { IOrder } from "../interfaces/order/order.interface";
import ApiError from "./ApiError";
const baseApi = process.env.OTO_BASE_API;

interface ErrorResponse {
  response: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    config: AxiosRequestConfig;
    data: {
      success: boolean;
      errorCode: number;
      errorMsg: string;
    };
  };
}
interface ErrorRefresh {
  code: string,
  config: any,
  request: any,
  response: {
    status: number,
    statusText: string,
    headers: any,
    config: any,
    request: any,
    data:{
      error: {
        code: string,
        message: string,
        status: string
      }
    }

  }
}

export default class OTOShipping {
  static async refreshToken() {
    const data = { refresh_token: process.env.OTO_REFRESH_TOKEN };

    if(!baseApi) {
      throw new ApiError(
        {
          en: `OTO_BASE_API is not defined`,
          ar: `OTO_BASE_API is not defined`,
        },
        StatusCodes.BAD_REQUEST
      );
    }

    if(!process.env.OTO_REFRESH_TOKEN) {
      throw new ApiError(
        {
          en: `MISSING_REFRESH_TOKEN`,
          ar: `MISSING_REFRESH_TOKEN`,
        },
        StatusCodes.BAD_REQUEST
      );
    }

    try {
      const response = await axios.post(
        `${baseApi}/rest/v2/refreshToken`,
        data,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      return response?.data?.access_token;
    } catch (err) {
      console.log("error from refreshToken ::: ", err);
      
      console.log("err from refreshToken ::: ", (err as ErrorResponse)?.response?.data?.errorMsg);
      console.log("errror ::::: ",JSON.stringify((err as ErrorRefresh)?.response?.data?.error?.message, null, 2));
      
      throw new ApiError(
        {
          en: `${JSON.stringify((err as ErrorRefresh)?.response?.data?.error?.message, null, 2)}`,
          ar: `${JSON.stringify((err as ErrorRefresh)?.response?.data?.error?.message, null, 2)}`,
        },
        StatusCodes.BAD_REQUEST
      );
    }
  }

  async availableCities(limit: number, page: number) {
    let access_token: string;
    try {
      access_token = await OTOShipping.refreshToken();
    } catch (err) {
      throw err;
    }

    const data = { limit, page };

    try {
      const response = await axios.post(
        `${baseApi}/rest/v2/availableCities`,
        data,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,
          },
        }
      );

      return response?.data;
    } catch (err) {
      console.log("error ::: ", err);
      console.log("err ::: ", (err as ErrorResponse)?.response?.data?.errorMsg);
      if(!(err as ErrorResponse)?.response?.data?.errorMsg) {
        throw new ApiError(
          {
            en: `Something went wrong in oto system`,
            ar: `حدث خطأ ما في نظام اوتو بالرجاء المحاولة مرة اخرى`,
          },
          StatusCodes.BAD_REQUEST
        );
      }
      
      throw new ApiError(
        {
          en: `${(err as ErrorResponse)?.response?.data?.errorMsg}`,
          ar: `${(err as ErrorResponse)?.response?.data?.errorMsg}`,
        },
        StatusCodes.BAD_REQUEST
      );
    }
  }

  async checkDeliveryFee(
    itemDetails = {
      weight: Number,
      totalDue: Number,
      originCity: String,
      destinationCity: String,
    }
  ) {
    let access_token: string;
    try {
      access_token = await OTOShipping.refreshToken();
    } catch (err) {
      throw err;
    }

    const data = {
      weight: itemDetails.weight,
      totalDue: itemDetails.totalDue,
      originCity: itemDetails.originCity,
      destinationCity: itemDetails.destinationCity,
    };

    try {
      const response = await axios.post(
        `${baseApi}/rest/v2/checkDeliveryFee`,
        data,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,
          },
        }
      );

      return response?.data;
    } catch (err) {
      console.log("error ::: ", err);
      console.log("err ::: ", (err as ErrorResponse)?.response?.data?.errorMsg);
      if(!(err as ErrorResponse)?.response?.data?.errorMsg) {
        throw new ApiError(
          {
            en: `Something went wrong in oto system`,
            ar: `حدث خطأ ما في نظام اوتو بالرجاء المحاولة مرة اخرى`,
          },
          StatusCodes.BAD_REQUEST
        );
      }
      
      throw new ApiError(
        {
          en: `${(err as ErrorResponse)?.response?.data?.errorMsg}`,
          ar: `${(err as ErrorResponse)?.response?.data?.errorMsg}`,
        },
        StatusCodes.BAD_REQUEST
      );
    }
  }

  async createOrder(
    order: IOrder,
    cashItems: any,
    onlineItems: any,
    orderId: string,
    pickupLocationCode: string
  ) {
    let access_token: string;
    try {
      access_token = await OTOShipping.refreshToken();
    } catch (err) {
      throw err;
    }

    const packageCount =
      cashItems.reduce((acc: number, item: any) => acc + item.quantity, 0) +
      onlineItems.reduce((acc: number, item: any) => acc + item.quantity, 0);
    const packageWeight =
      onlineItems.reduce(
        (acc: number, item: any) => acc + item.product.weight,
        0
      ) +
      cashItems.reduce(
        (acc: number, item: any) => acc + item.product.weight,
        0
      );

    const totalCash = cashItems.reduce(
      (acc: number, item: any) => acc + item.totalPrice,
      0
    );
    const totalOnline = onlineItems.reduce(
      (acc: number, item: any) => acc + item.totalPrice,
      0
    );

    const data = {
      orderId: orderId,
      payment_method: cashItems.length > 0 ? "cod" : "paid",
      amount: totalCash + totalOnline,
      amount_due: totalCash,
      pickupLocationCode: pickupLocationCode,
      currency: "SAR",
      packageCount: packageCount,
      packageWeight: packageWeight,
      customer: {
        name: order.name,
        email: order.email,
        mobile: order.phone,
        address: order.address,
        city: order.city,
        country: order.country,
        postalCode: order.postalCode,
        // lat: order.Latitude,
        // lon: order.Longitude,
      },
      items: [
        ...onlineItems.map((item: any) => ({
          // productId: item.product._id,
          name: item.product.title_en,
          price: item.totalPrice / item.quantity,
          quantity: item.quantity,
          rowTotal: item.totalPrice,
          sku: item.product.title_en.split(" ").join("-"),
          image: item.product.imagesUrl?.[0] || "image.png",
        })),
        ...cashItems.map((item: any) => ({
          // productId: item.product._id.toString(),
          name: item.product.title_en,
          price: item.totalPrice / item.quantity,
          quantity: item.quantity,
          rowTotal: item.totalPrice,
          sku: item.product.title_en.split(" ").join("-"),
          image: item.product.imagesUrl?.[0] || "image.png",
        })),
      ],
    };

    console.log("data ::: ", data);

    try {
      const response = await axios.post(
        `${baseApi}/rest/v2/createOrder`,
        data,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,
          },
        }
      );

      return response?.data;
    } catch (err) {
      console.log("error ::: ", err);
      console.log("err ::: ", (err as ErrorResponse)?.response?.data?.errorMsg);
      if(!(err as ErrorResponse)?.response?.data?.errorMsg) {
        throw new ApiError(
          {
            en: `Something went wrong in oto system`,
            ar: `حدث خطأ ما في نظام اوتو بالرجاء المحاولة مرة اخرى`,
          },
          StatusCodes.BAD_REQUEST
        );
      }
      throw new ApiError(
        {
          en: `${(err as ErrorResponse)?.response?.data?.errorMsg}`,
          ar: `${(err as ErrorResponse)?.response?.data?.errorMsg}`,
        },
        StatusCodes.BAD_REQUEST
      );
    }
  }

  async cancelOrder(orderId: string) {
    let access_token: string;
    try {
      access_token = await OTOShipping.refreshToken();
    } catch (err) {
      throw err;
    }

    const data = {
      orderId: orderId,
    };

    try {
      const response = await axios.post(
        `${baseApi}/rest/v2/cancelOrder`,
        data,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,
          },
        }
      );

      return response?.data;
    } catch (err) {
      console.log("error ::: ", err);
      console.log("err ::: ", (err as ErrorResponse)?.response?.data?.errorMsg);
      if(!(err as ErrorResponse)?.response?.data?.errorMsg) {
        throw new ApiError(
          {
            en: `Something went wrong in oto system`,
            ar: `حدث خطأ ما في نظام اوتو بالرجاء المحاولة مرة اخرى`,
          },
          StatusCodes.BAD_REQUEST
        );
      }
      
      throw new ApiError(
        {
          en: `${(err as ErrorResponse)?.response?.data?.errorMsg}`,
          ar: `${(err as ErrorResponse)?.response?.data?.errorMsg}`,
        },
        StatusCodes.BAD_REQUEST
      );
    }
  }

  async orderStatus(orderId: string) {
    let access_token: string;
    try {
      access_token = await OTOShipping.refreshToken();
    } catch (err) {
      throw err;
    }

    const data = {
      orderId: orderId,
    };

    try {
      const response = await axios.post(
        `${baseApi}/rest/v2/orderStatus`,
        data,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,
          },
        }
      );

      return response?.data;
    } catch (err) {
      console.log("error ::: ", err);
      console.log("err ::: ", (err as ErrorResponse)?.response?.data?.errorMsg);
      if(!(err as ErrorResponse)?.response?.data?.errorMsg) {
        throw new ApiError(
          {
            en: `Something went wrong in oto system`,
            ar: `حدث خطأ ما في نظام اوتو بالرجاء المحاولة مرة اخرى`,
          },
          StatusCodes.BAD_REQUEST
        );
      }
      
      throw new ApiError(
        {
          en: `${(err as ErrorResponse)?.response?.data?.errorMsg}`,
          ar: `${(err as ErrorResponse)?.response?.data?.errorMsg}`,
        },
        StatusCodes.BAD_REQUEST
      );
    }
  }

  async createPickupLocation(pickupLocation: {
    type: string;
    name_en: string;
    code: string;
    address: string;
    city: string;
    country: string;
    mobile: string;
    contactEmail: string;
    contactName: string;
  }) {
    let access_token: string;
    try {
      access_token = await OTOShipping.refreshToken();
    } catch (err) {
      throw err;
    }

    const data = {
      type: pickupLocation.type,
      name: pickupLocation.name_en,
      code: pickupLocation.code,
      city: pickupLocation.city,
      address: pickupLocation.address,
      country: pickupLocation.country,
      mobile: pickupLocation.mobile,
      contactEmail: pickupLocation.contactEmail,
      contactName: pickupLocation.contactName,
    };

    try {
      const response = await axios.post(
        `${baseApi}/rest/v2/createPickupLocation`,
        data,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,
          },
        }
      );


      return response?.data;
    } catch (err) {
      console.log("error ::: ", err);
      console.log("err ::: ", (err as ErrorResponse)?.response?.data?.errorMsg);

      if(!(err as ErrorResponse)?.response?.data?.errorMsg) {
        throw new ApiError(
          {
            en: `Something went wrong in oto system`,
            ar: `حدث خطأ ما في نظام اوتو بالرجاء المحاولة مرة اخرى`,
          },
          StatusCodes.BAD_REQUEST
        );
      }
      throw new ApiError(
        {
          en: `${(err as ErrorResponse)?.response?.data?.errorMsg}`,
          ar: `${(err as ErrorResponse)?.response?.data?.errorMsg}`,
        },
        StatusCodes.BAD_REQUEST
      );
    }
  }

  async updatePickupLocation(pickupLocation: {
    type: string;
    code: string;
    name_en: string;
    address: string;
    city: string;
    country: string;
    mobile: string;
    contactEmail: string;
    contactName: string;
  }) {
    let access_token: string;
    try {
      access_token = await OTOShipping.refreshToken();
    } catch (err) {
      throw err;
    }

    const data = {
      type: pickupLocation.type,
      name: pickupLocation.name_en,
      code: pickupLocation.code,
      city: pickupLocation.city,
      address: pickupLocation.address,
      country: pickupLocation.country,
      mobile: pickupLocation.mobile,
      contactEmail: pickupLocation.contactEmail,
      contactName: pickupLocation.contactName,
    };

    try {
      const response = await axios.post(
        `${baseApi}/rest/v2/updatePickupLocation`,
        data,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,
          },
        }
      );
      return response?.data;
    } catch (err) {
      console.log("error ::: ", err);
      console.log("err ::: ", (err as ErrorResponse)?.response?.data?.errorMsg);
      if(!(err as ErrorResponse)?.response?.data?.errorMsg) {
        throw new ApiError(
          {
            en: `Something went wrong in oto system`,
            ar: `حدث خطأ ما في نظام اوتو بالرجاء المحاولة مرة اخرى`,
          },
          StatusCodes.BAD_REQUEST
        );
      }
      // i want save err in file
      throw new ApiError(
        {
          en: `${(err as ErrorResponse)?.response?.data?.errorMsg}`,
          ar: `${(err as ErrorResponse)?.response?.data?.errorMsg}`,
        },
        StatusCodes.BAD_REQUEST
      );
    }
  }

  async getAllPickupLocations() {}
}
