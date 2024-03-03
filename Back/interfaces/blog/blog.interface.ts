import { Types, Document } from "mongoose";

export interface IBlog extends Document {
    title: string;
    description: string;
    image: string;
    comments: [
        {
            _id: any;
            user: {
                userId: Types.ObjectId;
                email: string;
            };
            comment: string;
            replies: [
                {
                    _id: any;
                    user: {
                        userId: Types.ObjectId;
                        email: string;
                    };
                    reply: string;
                }
            ];
        }
    ];
}
