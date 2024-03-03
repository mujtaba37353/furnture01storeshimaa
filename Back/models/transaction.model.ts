import { Schema, model } from "mongoose"; 
import { ITransaction } from "../interfaces/moyasar/moyasar.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    id: { type: String },
    status: { type: String },
    amount: { type: Number },
    fee: { type: Number },
    currency: { type: String },
    refunded: { type: Number },
    refunded_at: { type: String },
    captured: { type: Number },
    captured_at: { type: String },
    voided_at: { type: String },
    description: { type: String },
    amount_format: { type: String },
    fee_format: { type: String },
    refunded_format: { type: String },
    captured_format: { type: String },
    invoice_id: { type: String },
    ip: { type: String },
    callback_url: { type: String },
    created_at: { type: String },
    updated_at: { type: String },
    metadata: {
      order_id: { type: String },
      user_id: { type: String },
      total_quantity: { type: Number },
    },
    source: {
      type: { type: String },
      company: { type: String },
      name: { type: String },
      number: { type: String },
      gateway_id: { type: String },
      reference_number: { type: String },
      token: { type: String },
      message: { type: String },
      transaction_url: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = model<ITransaction>("Transaction", transactionSchema);

export default Transaction;
