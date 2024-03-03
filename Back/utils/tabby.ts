import axios from "axios";
import { StatusCodes } from "http-status-codes";
import ApiError from "./ApiError";

// interface DataInterface {
//   payment: {
//     amount: string;
//     currency: string;
//     buyer: {
//       phone: string;
//       email: string;
//       name: string;
//     };
//     buyer_history: {
//       registered_since: string;
//       loyalty_level: number;
//       wishlist_count: number;
//       is_social_networks_connected: boolean;
//       is_phone_number_verified: boolean;
//       is_email_verified: boolean;
//     };
//     order: {
//       tax_amount: string;
//       shipping_amount: string;
//       discount_amount: string;
//       updated_at: string;
//       reference_id: string;
//       items: [
//         {
//           title: string;
//           description: string;
//           quantity: 1;
//           unit_price: string;
//           discount_amount: string;
//           reference_id: string;
//           image_url: string;
//           category: string;
//         }
//       ];
//     };
//     shipping_address: {
//       city: string;
//       address: string;
//       zip: string;
//     };
//     meta: {
//       order_id: string;
//       customer: string;
//     };
//     attachment: {
//       body: '{"flight_reservation_details": {"pnr": "TR9088999","itinerary": [...],"insurance": [...],"passengers": [...],"affiliate_name": "some affiliate"}}';
//       content_type: "application/vnd.tabby.v1+json";
//     };
//   };
//   lang: string;
//   merchant_code: string;
//   merchant_urls: {
//     success: string;
//     cancel: string;
//     failure: string;
//   };
// }
interface DataInterface {
  payment: {
      amount: string;
      currency: string;
      buyer: {
          phone: string;
          email: string | undefined;
          name: string;
      };
      buyer_history: {
          registered_since: Date;
          loyalty_level: number;
          wishlist_count: number;
          is_social_networks_connected: boolean;
          is_phone_number_verified: boolean;
          is_email_verified: boolean;
      };
      order: {
          tax_amount: string;
          shipping_amount: string;
          discount_amount: string;
          updated_at: Date;
          reference_id: string;
          items: any[]; // Assuming items can be any type
      };
      shipping_address: {
          city: string;
          address: string;
          zip: string;
      };
      meta: {
          order_id: string;
          customer: string;
      };
      attachment: {
          body: string;
          content_type: string;
      };
  };
  lang: string;
  merchant_code: string;
  merchant_urls: {
      success: string;
      cancel: string;
      failure: string;
  };
}



export default class Tabby {
  // Create a Session
  async checkout(data: DataInterface) {
    try {
      const response = await axios.post(
        `https://api.tabby.ai/api/v2/checkout`,
        data,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + process.env.TABBY_PUBLIC_KEY,
          },
        }
      );

      return response?.data;
    } catch (err) {
      throw new ApiError(
        {
          en: (err as any).response.data.error,
          ar: (err as any).response.data.error,
        },
        StatusCodes.BAD_REQUEST
      );
    }
  }

  // Payments
  async retrievePayment(paymentId: string) {    
    try {
      const response = await axios.get(`https://api.tabby.ai/api/v2/payments/${paymentId}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + process.env.TABBY_SECRET_KEY,
          },
        }
      );

      return response?.data;
    } catch (err) {
      
      throw new ApiError(
        {
          en: (err as any).response.data.error,
          ar: (err as any).response.data.error,
        },
        StatusCodes.BAD_REQUEST
      );
    }
  }
  async updatePayment() {}
  async capturePayment() {}
  async refundPayment() {}
  async closePayment() {}
  async listAllPayments() {}
  async cancelRefundOfPayment() {}

  // Webhooks
  async registerWebhook() {}
  async retrieveAllWebhook() {}
  async retrieveWebhook() {}
  async updateWebhook() {}
  async deleteWebhook() {}
}
