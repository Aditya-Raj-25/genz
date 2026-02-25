import { Model, Document } from 'mongoose';
import { IRepository } from '../interfaces/IRepository';

export abstract class BaseRepository<T extends Document> implements IRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findAll(filters: any = {}): Promise<T[]> {
    return this.model.find(filters).exec();
  }

  async create(data: any): Promise<T> {
    const item = new this.model(data);
    return item.save();
  }

  async update(id: string, data: any): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }
}
