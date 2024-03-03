

import { Document, Query } from "mongoose";
import { IQuery } from "../interfaces/factory/factory.interface";

export class ApiFeatures<T extends Document> {
  paginationResult: {
    totalPages: number;
    page: number;
    limit: number;
  } = { totalPages: 0, page: 0, limit: 0 };
  data: T[] = [];
  constructor(
    public mongooseQuery: Query<T[], T>,
    public queryString: IQuery
  ) {}

  sort() {
    const sort = this.queryString?.sort?.split(",").join(" ") || "-createdAt";
    this.mongooseQuery.sort(sort);
    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = [
      "sort",
      "limit",
      "page",
      "fields",
      "keyword",
      "populate",
    ];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|eq|ne|in|nin)\b/g,
      (match) => `$${match}`
    );
    let parsedQueryString;
    if(queryStr.includes('$in')){

         parsedQueryString=JSON.parse(queryStr)
        let splitedTypes=Array.from(parsedQueryString['type']['$in'].split(','))

        parsedQueryString['type']["$in"]=splitedTypes

        queryStr=JSON.stringify(parsedQueryString)

    }
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }

  search() {
    const { keyword } = this.queryString;

    if (keyword) {
      const keywordObj = {
        $or: Object.keys(keyword).map((key) => {
          if (typeof keyword[key] === "string") {
            return {
              [key]: { $regex: keyword[key], $options: "i" },
            };
          }
          const keys = (keyword[key] as unknown as [string]).map((value) => ({
            [key]: { $regex: value, $options: "i" },
          }));
          return { $or: keys };
        }),
      } as any;

      this.mongooseQuery = this.mongooseQuery.find(keywordObj);
    }

    return this;
  }

  limitFields() {
    const { fields } = this.queryString;
    if (fields) {
      const fieldsBy = fields.split(",").join(" ");

      this.mongooseQuery = this.mongooseQuery.select(fieldsBy);
    }
    return this;
  }

  populate() {
    const populate = this.queryString?.populate?.split(",").join(" ");
    if (populate) {
      this.mongooseQuery = this.mongooseQuery.populate(populate);
    }
    return this;
  }


  async paginate() {
    const { limit, page } = this.queryString;
    const pageNumber = page ? +page : 1;
    const limitNumber = limit ? +limit : 10;
    const skip = (pageNumber - 1) * limitNumber;
    const countQuery = this.mongooseQuery.model.find({
      ...this.mongooseQuery.getQuery(),
    });
    const total = await countQuery.countDocuments();
    const totalPages = Math.ceil(total / limitNumber);

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limitNumber);
    this.paginationResult = {
      totalPages,
      page: pageNumber,
      limit: limitNumber,
    };

    this.data = await this.mongooseQuery;
    return this;
  }
}