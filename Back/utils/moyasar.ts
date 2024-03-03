// @ts-ignore
import MoyasarNPM from "moyasar";
import {
  ITransaction,
  PaymentOptions,
  InvoiceOptions,
} from "../interfaces/moyasar/moyasar.interface";

export default class Moyasar {
  moyasar;
  constructor() {
    this.moyasar = new MoyasarNPM(process.env.MOYASAR_SECRET_KEY);
  }

  async createPayment(paymentOptions: PaymentOptions): Promise<ITransaction> {
    try {
      return await this.moyasar.payment.sendRequest(
        "payments",
        "POST",
        paymentOptions
      );
    } catch (error) {
      console.log(`Error in creating payment: ${error}`.red);
      throw error;
    }
  }

  async getPayment(paymentId: string) {
    try {
      return await this.moyasar.payment.sendRequest(
        `payments/${paymentId}`,
        "GET"
      );
    } catch (error) {
      console.log(`Error in getting payment: ${error}`.red);
      throw error;
    }
  }

  async createInvoice(invoiceOptions: InvoiceOptions) {
    try {
      return await this.moyasar.invoice.sendRequest(
        "invoices",
        "POST",
        invoiceOptions
      );
    } catch (error) {
      console.log(`Error in creating invoice: ${error}`.red);
      throw error;
    }
  }

  async getInvoice() {}

  async createRefund() {}

  async getList({ page, per }: { page: Number; per: Number }) {
    try {
      return await this.moyasar.payment.list({ page, per });
    } catch (error) {
      console.log(`Error in getting list of payments: ${error}`.red);
      throw error;
    }
  }
}
