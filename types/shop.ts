export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface Shop {
  id: string;
  name: string;
  coverImage: string;
  featuredItems: MenuItem[];
}
