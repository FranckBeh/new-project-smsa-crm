export interface Invoice {
  id: number;
  customerName: string;
  customerAddress: string;
  items: Item[];
  date: Date;
  total: number;
}

export interface Item {
  name: string;
  quantity: number;
  price: number;
}
