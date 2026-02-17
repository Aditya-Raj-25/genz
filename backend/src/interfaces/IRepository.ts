export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(filters: any): Promise<T[]>;
  create(data: any): Promise<T>;
  update(id: string, data: any): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
