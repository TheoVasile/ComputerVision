import mongoose from "mongoose";

const imageSchema = mongoose.Schema(
    {
        img:
        {
            data: Buffer,
            contentType: String,
        }
    }
);

export const Img = mongoose.model('Img', imageSchema);