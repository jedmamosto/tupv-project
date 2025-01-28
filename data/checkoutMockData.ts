import { MenuItem } from "../types/shop";

export const mockOrderItems: MenuItem[] = [
  {
    id: "1",
    name: "Adobo",
    price: 100.0,
    quantity: 1,
    image: require("../assets/images/placeholder-banner.jpg"),
    available: true,
  },
  {
    id: "2",
    name: "Rice",
    price: 12.0,
    quantity: 2,
    image: require("../assets/images/placeholder-banner.jpg"),
    available: true,
  },
];

export const mockPaymentMethods = [
  { id: "counter", name: "Pay at the counter" },
  { id: "gcash", name: "Pay through GCash" },
];
