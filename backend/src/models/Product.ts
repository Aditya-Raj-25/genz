import mongoose, { Schema, Document } from 'mongoose';

export enum GenderCategory {
  MEN = 'Men',
  WOMEN = 'Women'
}

export interface IProduct extends Document {
  productUrl: string;
  brand: string;
  description: string;
  idProduct: string;
  imageUrl: string;
  categoryByGender: GenderCategory;
  discountPrice: number;
  originalPrice: number;
  color: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  productUrl: { type: String, required: true },
  brand: { type: String, required: true },
  description: { type: String, required: true },
  idProduct: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  categoryByGender: { type: String, enum: Object.values(GenderCategory), required: true },
  discountPrice: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  color: { type: String, required: true },
  viewCount: { type: Number, default: 0 }
}, { timestamps: true });

// Index for search
ProductSchema.index({ brand: 'text', description: 'text' });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ color: 1 });
ProductSchema.index({ categoryByGender: 1 });
ProductSchema.index({ discountPrice: 1 });

export default mongoose.model<IProduct>('Product', ProductSchema);
