export interface OrderDetail {
  productId: number;
  quantity: number;
}

export interface CreateOrder {
  shippingAddress: string;
  orderDetails: OrderDetail[];
}

export interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  orderDetails: {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
}
