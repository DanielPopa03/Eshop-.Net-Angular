import { Product } from "../product/product";
import { User } from "../user/user";

export class Supplier {
  id!: number;
  contactEmail!: string;
  name!: string;

  products?: Product[];
  users?: User[];
}
