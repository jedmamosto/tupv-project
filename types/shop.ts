export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: any;
  available: boolean;
  description?: string;
  category?: string;
  quantity?: number;
  options?: {
    name: string;
    choices: {
      id: string;
      name: string;
      price?: number;
    }[];
  }[];
}

export interface Shop {
  id: string;
  name: string;
  coverImage: any;
  description?: string;
  categories?: ProductCategory[];
  featuredItems: MenuItem[];
  menuItems: MenuItem[];
}

export interface ProductCategory {
  id: string;
  name: string;
}
