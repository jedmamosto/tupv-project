import { User } from './user';
import { Shop, MenuItem } from './shop';
import { Cart } from './cart';
import { Order } from './order';
import { PaymentInformation } from './payment';

export type FirestoreUser = User;
export type FirestoreShop = Shop;
export type FirestoreMenuItem = MenuItem;
export type FirestoreCart = Cart;
export type FirestoreOrder = Order;
export type FirestorePayment = PaymentInformation;
