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
      },
      {
        id: "2",
        name: "Featured Item 2",
        price: 12.99,
        image: require("../assets/images/placeholder-featured2.jpg"),
      },
      {
        id: "3",
        name: "Featured Item 3",
        price: 8.99,
        image: require("../assets/images/placeholder-featured2.jpg"),
      },
      {
        id: "4",
        name: "Featured Item 4",
        price: 11.99,
        image: require("../assets/images/placeholder-featured2.jpg"),
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
      },
      {
        id: "6",
        name: "Featured Item 6",
        price: 13.99,
        image: require("../assets/images/placeholder-featured.jpg"),
      },
      {
        id: "7",
        name: "Featured Item 7",
        price: 7.99,
        image: require("../assets/images/placeholder-featured.jpg"),
      },
      {
        id: "8",
        name: "Featured Item 8",
        price: 15.99,
        image: require("../assets/images/placeholder-featured.jpg"),
      },
    ],
  },
];
