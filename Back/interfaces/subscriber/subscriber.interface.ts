import { Document } from "mongoose";

export default interface ISubscriber extends Document {
    email: string;
}
  