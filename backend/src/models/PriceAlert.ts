import mongoose, { Schema, Document } from 'mongoose';

export interface IPriceAlert extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  targetPrice: number;
  triggered: boolean;
  triggeredAt?: Date;
  createdAt: Date;
}

const PriceAlertSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  targetPrice: { type: Number, required: true },
  triggered: { type: Boolean, default: false },
  triggeredAt: { type: Date }
}, { timestamps: { createdAt: true, updatedAt: false } });

PriceAlertSchema.index({ triggered: 1 });

export default mongoose.model<IPriceAlert>('PriceAlert', PriceAlertSchema);
