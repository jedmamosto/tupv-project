import { Shop } from "../types/shop";

export const mockShops: Shop[] = [
  {
    id: "1",
    name: "Jed's EatsHerY",
    coverImage: require("../assets/images/placeholder-banner.jpg"),
    featuredItems: [
      {
        id: "1",
        name: "Featured Item 1",
        price: 9.99,
        image: require("../assets/images/placeholder-featured2.jpg"),
        available: true,
      },
      {
        id: "2",
        name: "Featured Item 2",
        price: 12.99,
        image: require("../assets/images/placeholder-featured2.jpg"),
        available: true,
      },
      {
        id: "3",
        name: "Featured Item 3",
        price: 8.99,
        image: require("../assets/images/placeholder-featured2.jpg"),
        available: true,
      },
      {
        id: "4",
        name: "Featured Item 4",
        price: 11.99,
        image: require("../assets/images/placeholder-featured2.jpg"),
        available: true,
      },
    ],
    menuItems: [
      {
        id: "m1",
        name: "Adobo",
        price: 50.0,
        image: require("../assets/images/placeholder-featured2.jpg"),
        available: true,
      },
      {
        id: "m2",
        name: "Ramen",
        price: 60.0,
        image: require("../assets/images/placeholder-featured2.jpg"),
        available: true,
      },
      {
        id: "m3",
        name: "Burger",
        price: 30.0,
        image: require("../assets/images/placeholder-featured2.jpg"),
        available: true,
      },
      {
        id: "m4",
        name: "Rice",
        price: 12.0,
        image: require("../assets/images/placeholder-featured2.jpg"),
        available: true,
      },
    ],
  },
  {
    id: "2",
    name: "Sam's Peak Food",
    coverImage: require("../assets/images/placeholder-banner.jpg"),
    featuredItems: [
      {
        id: "5",
        name: "Featured Item 5",
        price: 10.99,
        image: require("../assets/images/placeholder-featured.jpg"),
        available: true,
      },
      {
        id: "6",
        name: "Featured Item 6",
        price: 13.99,
        image: require("../assets/images/placeholder-featured.jpg"),
        available: true,
      },
      {
        id: "7",
        name: "Featured Item 7",
        price: 7.99,
        image: require("../assets/images/placeholder-featured.jpg"),
        available: true,
      },
      {
        id: "8",
        name: "Featured Item 8",
        price: 15.99,
        image: require("../assets/images/placeholder-featured.jpg"),
        available: true,
      },
    ],
    menuItems: [
      {
        id: "m5",
        name: "Sisig",
        price: 45.0,
        image: require("../assets/images/placeholder-featured.jpg"),
        available: true,
      },
      {
        id: "m6",
        name: "Pancit",
        price: 55.0,
        image: require("../assets/images/placeholder-featured.jpg"),
        available: true,
      },
    ],
  },
];
