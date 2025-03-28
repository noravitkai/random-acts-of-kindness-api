export interface Category extends Document {
  _id: string;
  name: string;
  description?: string;
}
