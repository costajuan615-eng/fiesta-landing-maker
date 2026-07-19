export type MenuItem = {
  name: string;
  description?: string;
  price?: string;
  badge?: string;
};

export const mostOrdered: MenuItem[] = [
  { name: "Taco Sampler", description: "A hand-picked assortment of our signature tacos." },
  { name: "Taco Order (4)", description: "Four tacos, your choice of protein." },
  {
    name: "Taco Plate (3)",
    description:
      "Three tacos with rice and beans on the side. Served with cilantro, onion, radish, lime and salsa.",
  },
  {
    name: "Mulitas (2)",
    description: "Two corn tortillas stacked with cheese and your choice of protein. Two per order.",
  },
  {
    name: "Quesadillas",
    description: "12-inch flour tortilla filled with your choice of protein, cut into 3.",
  },
  {
    name: "Burrito Supreme",
    description:
      "12-inch flour tortilla filled with beans, cheese, rice and your choice of meat. Loaded with onion, tomato, cilantro, jalapeño and sour cream.",
  },
  {
    name: "Loaded Nachos",
    description:
      "Tostadas topped with our in-house nacho cheese, beans and your choice of meat, with cilantro, onion, tomato, jalapeño and sour cream.",
  },
  {
    name: "Loaded Fries",
    description:
      "Waffle fries topped with your choice of meat and our in-house nacho cheese, loaded with cilantro, onion, tomato, jalapeño and sour cream.",
  },
  {
    name: "Tortas",
    description:
      "Mexican torta bread filled with your choice of meat. Upcharge to make it loaded — cheese, beans, onion, tomato, cilantro, jalapeño and sour cream.",
  },
  {
    name: "Grilled Cheese",
    description: "Texas toast filled with American cheese and your choice of protein.",
  },
  { name: "Birria Ramen", description: "House birria broth over ramen — rich, spicy, unforgettable." },
];

export const extrasSides: MenuItem[] = [
  { name: "Beans", description: "Delicious refried beans served with cheese on top.", price: "$4.00" },
  {
    name: "Guacamole (1.5 oz cup)",
    description: "Avocado, lime, red onion, cilantro and tomato.",
    price: "$1.00",
    badge: "100% liked (9)",
  },
  { name: "Corn Tortillas (2)", description: "Two warm corn tortillas.", price: "$2.00" },
  {
    name: "8 oz Consomé",
    description: "Rich 8 oz birria consomé. Condiments sold separately.",
    price: "$4.00",
    badge: "81% liked (11)",
  },
  {
    name: "Condiments",
    description: "Extra side of lime, salsa, onion, cilantro and radishes.",
    price: "$1.00",
    badge: "#2 Most Liked · 95% (23)",
  },
];

export const categories = [
  { name: "Dessert", note: "Sweet finishers, rotating selection." },
  { name: "Agua Fresca", note: "Refreshing agua fresca in different flavors." },
  { name: "Kids Meal", note: "Kid-sized portions of the classics." },
];

export type Review = {
  initial: string;
  name: string;
  contributions: string;
  sentiment: "Loved" | "Liked";
  date: string;
  text: string;
};

export const reviews: Review[] = [
  {
    initial: "E",
    name: "Elaine G",
    contributions: "1 contribution",
    sentiment: "Loved",
    date: "6/27/26",
    text: "Food was soo amazing!! The Loaded Bomba Fries were well worth the price. It came with so much meat. The Horchata was delicious and authentic. 10/10 recommend!!",
  },
  {
    initial: "L",
    name: "Leticia G",
    contributions: "4 contributions",
    sentiment: "Liked",
    date: "12/6/25",
    text: "I ordered the Bomba Quesatacos — not only were they fast in preparing my order, the flavor was outstanding and they were loaded with meat. I 100% recommend them. I know I will definitely be going back.",
  },
  {
    initial: "A",
    name: "Andrew S",
    contributions: "1 contribution",
    sentiment: "Loved",
    date: "12/7/25",
    text: "Wow! This was the first time I've ordered from La Bomba. Every part of my order was excellent! I ordered the Carne Asada Tacos for my wife — four tacos of a generous size. She said they were very delicious and full of flavor, as were the salsas. I ordered the La Bomba Burrito and it was very delicious — savory tender pulled pork, rice, peppers, tomatoes and more goodness. The tortilla exterior was toasted, providing firmness so it can be dipped in birria consomé. I also tried the La Bomba Asada Fries — seasoned asada, jalapeños, guacamole, sour cream and tomatoes over waffle fries. A new favorite. Put La Bomba on your must-try list!",
  },
  {
    initial: "C",
    name: "Cole F",
    contributions: "4 contributions",
    sentiment: "Loved",
    date: "7/14/24",
    text: "Absolutely amazing!! Bussin! Presented perfectly, great portions and very reasonable prices! Bomba Quesatacos so delicious and that consomé is perfect.",
  },
  {
    initial: "N",
    name: "Nicole B",
    contributions: "Emerging Expert · 11 contributions",
    sentiment: "Loved",
    date: "5/9/25",
    text: "Was so happy to see this keto option! The Bomba Keto Taco is greasy but delicious, and also quite filling. Would get again and recommend to others.",
  },
];

export const BUSINESS = {
  name: "La Bomba LLC",
  tagline: "Bomb birria, asada, pastor & carnitas — El Paso, TX",
  description:
    "Former food truck now brick-and-mortar restaurant serving bomb birria, asada, pastor and carnitas in EP, TX.",
  address: "1793 N Zaragoza Rd, El Paso, TX 79936",
  phone: "(915) 308-2878",
  phoneHref: "tel:+19153082878",
  hours: "11:00 AM – 9:55 PM",
  rating: 4.8,
  ratingCount: "500+",
  reviewCount: "50+",
  priceRange: "$$",
  cuisine: "Mexican",
  doorDashUrl: "https://www.doordash.com/search/store/la%20bomba%20el%20paso/",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=1793+N+Zaragoza+Rd,+El+Paso,+TX+79936",
  mapsEmbedUrl:
    "https://www.google.com/maps?q=1793+N+Zaragoza+Rd,+El+Paso,+TX+79936&output=embed",
};
