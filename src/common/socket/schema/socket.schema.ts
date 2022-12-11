import * as mongoose from 'mongoose';
export const SocketSchema = new mongoose.Schema(
  {
    socketId: {
      type: String,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);
