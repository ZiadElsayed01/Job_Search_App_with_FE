import mongoose from "mongoose";

const blacklistModel = new mongoose.Schema({
  tokenId: {
    type: String,
    required: true,
  },
  expiredAt: {
    type: Date,
    required: true,
  },
});

export const BlackList = mongoose.models.BlackList || mongoose.model("BlackList", blacklistModel);