import { Schema, model } from "mongoose";

export interface IPointsManagement {
  noOfPointsInOneUnit: number;
  totalPointConversionForOneUnit: number;
  min: number;
  max: number;
  status: string;
}

const PointsMangementSchema = new Schema<IPointsManagement>({
  noOfPointsInOneUnit: Number,
  totalPointConversionForOneUnit: Number,
  min: Number,
  max: Number,
  status: { type: String, default: "static" },
});

const PointsManagement = model("points", PointsMangementSchema);
export default PointsManagement;
