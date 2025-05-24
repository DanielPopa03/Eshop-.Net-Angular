import { Order } from "../order/order";
import { Product } from "../product/product";

export class OrderedProduct {
  orderId!: number;
  productId!: number;
  quantity!: number;

  order!: Order;
  product!: Product;
}
