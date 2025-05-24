import { OrderedProduct } from "../ordered-product/ordered-product";
import { User } from "../user/user";

export class Order {
  id!: number;
  clientId!: number;
  placedAt!: Date;
  shippingStreet!: string;
  shippingCity!: string;
  shippingCounty!: string;
  shippingPostalCode!: string;

  client?: User;
  orderedProducts?: OrderedProduct[];
}
