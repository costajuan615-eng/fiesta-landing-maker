import tacoSampler from "@/assets/menu/taco-sampler.jpg";
import tacoOrder from "@/assets/menu/taco-order.jpg";
import tacoPlate from "@/assets/menu/taco-plate.jpg";
import mulitas from "@/assets/menu/mulitas.jpg";
import quesadillas from "@/assets/menu/quesadillas.jpg";
import burritoSupreme from "@/assets/menu/burrito-supreme.jpg";
import loadedNachos from "@/assets/menu/loaded-nachos.jpg";
import loadedFries from "@/assets/menu/loaded-fries.jpg";
import tortas from "@/assets/menu/tortas.jpg";
import grilledCheese from "@/assets/menu/grilled-cheese.jpg";
import birriaRamen from "@/assets/menu/birria-ramen.jpg";
import riceAndBeans from "@/assets/menu/rice-and-beans.jpg";
import rice from "@/assets/menu/rice.jpg";
import beans from "@/assets/menu/beans.jpg";
import guacamole from "@/assets/menu/guacamole.jpg";
import cornTortillas from "@/assets/menu/corn-tortillas.jpg";
import consome from "@/assets/menu/consome.jpg";
import condiments from "@/assets/menu/condiments.jpg";
import empanadas from "@/assets/menu/empanadas.jpg";
import tresLeches from "@/assets/menu/tres-leches.jpg";
import flan from "@/assets/menu/flan.jpg";
import aguaMelon from "@/assets/menu/agua-melon.jpg";
import aguaStrawberry from "@/assets/menu/agua-strawberry.jpg";
import aguaPistachio from "@/assets/menu/agua-pistachio.jpg";
import aguaJamaica from "@/assets/menu/agua-jamaica.jpg";
import kidsMeal from "@/assets/menu/kids-meal.jpg";
import kidsQuesadilla from "@/assets/menu/kids-quesadilla.jpg";
import kidsNuggets from "@/assets/menu/kids-nuggets.jpg";
import kidsTacoPlate from "@/assets/menu/kids-taco-plate.jpg";

export type MenuItem = {
  name: string;
  description?: string;
  price?: string;
  badge?: string;
  image?: string;
  category: MenuCategory;
};

export const MENU_CATEGORIES = [
  "Tacos",
  "Taco Plates",
  "Mulitas",
  "Quesadillas",
  "Burritos",
  "Loaded Nachos",
  "Loaded Fries",
  "Tortas",
  "Grilled Cheese",
  "Ramen",
  "Extras & Sides",
  "Dessert",
  "Agua Fresca",
  "Kids Meal",
] as const;
export type MenuCategory = (typeof MENU_CATEGORIES)[number];

export const menu: MenuItem[] = [
  // Tacos — Order of 4
  { category: "Tacos", name: "Taco Sampler", description: "A hand-picked assortment of our signature tacos.", image: tacoSampler },
  { category: "Tacos", name: "Queso Birria Taco Order (4)", description: "Slow-cooked beef and melted cheese in a corn tortilla, served with diced onions, cilantro, radishes, lime wedges, and a side of rich consomé.", price: "$15.25", badge: "Fan Favorite", image: tacoOrder },
  { category: "Tacos", name: "Pastor Taco Order (4)", description: "Four tacos with choice of chicken or pork pastor. Option to include pineapple.", price: "$12.50", image: tacoOrder },
  { category: "Tacos", name: "Tripitas Taco Order (4)", description: "Corn tortillas filled with tender beef tripe, garnished with onions, cilantro, and a squeeze of lime. Four tacos.", price: "$14.00", image: tacoOrder },
  { category: "Tacos", name: "Carnitas Taco Order (4)", description: "Slow-cooked pork carnitas in corn tortillas, topped with onions, cilantro, and tomatillo salsa.", price: "$12.50", badge: "87% liked (8)", image: tacoOrder },
  { category: "Tacos", name: "Carne Asada Taco Order (4)", description: "Grilled marinated steak tacos on corn tortillas, garnished with cilantro, onions, and lime.", price: "$13.75", image: tacoOrder },
  { category: "Tacos", name: "Birria Taco Order (4) — No Cheese", description: "Shredded beef birria tacos garnished with onion and cilantro. Four corn tortillas.", price: "$13.75", image: tacoOrder },

  // Taco Plates (3 tacos + rice & beans)
  { category: "Taco Plates", name: "Pastor Taco Plate (3)", description: "Three tacos with spiced chicken or pork pastor. Option to add pineapple. Served with rice, beans, cilantro, onion, radish, lime and salsa.", price: "$13.50", badge: "87% liked (8)", image: tacoPlate },
  { category: "Taco Plates", name: "Carnitas Taco Plate (3)", description: "Three carnitas tacos with a side of Mexican rice and refried beans topped with cheese. Served with lime wedges.", price: "$13.50", badge: "87% liked (8)", image: tacoPlate },
  { category: "Taco Plates", name: "Tripita Taco Plate (3)", description: "Grilled tripas tacos with cilantro, onions and salsa on soft corn tortillas. Served with rice and beans.", price: "$13.50", image: tacoPlate },
  { category: "Taco Plates", name: "Birria Taco Plate (3)", description: "Braised beef birria tacos with cilantro, onions, cheese and consomé dipping sauce. Served with rice and beans.", price: "$15.00", image: tacoPlate },
  { category: "Taco Plates", name: "Asada Taco Plate (3)", description: "Grilled steak tacos on corn tortillas, topped with fresh cilantro and onion. Served with rice and beans.", price: "$14.50", image: tacoPlate },

  // Mulitas (2)
  { category: "Mulitas", name: "Pastor Mulitas (2)", description: "Warm tortilla layers with chicken or pork pastor and melted cheese. Option to add pineapple. Two per order.", price: "$12.50", image: mulitas },
  { category: "Mulitas", name: "Carnitas Mulitas (2)", description: "Slow-cooked pork and melted cheese sandwiched between two corn tortillas, garnished with onions and cilantro.", price: "$12.50", image: mulitas },
  { category: "Mulitas", name: "Tripitas Mulitas (2)", description: "Grilled small corn tortillas with melted cheese and beef tripe, complemented by onions and cilantro.", price: "$13.50", image: mulitas },
  { category: "Mulitas", name: "Birria Mulitas (2)", description: "Tender birria layered with melted cheese between two crispy tortillas, with chopped onions and cilantro.", price: "$14.00", image: mulitas },
  { category: "Mulitas", name: "Asada Mulitas (2)", description: "Grilled beef between two handmade corn tortillas with melted cheese, onion, cilantro, guacamole and salsa ranchera.", price: "$13.50", image: mulitas },

  // Quesadillas
  { category: "Quesadillas", name: "Pastor Quesadilla", description: "12-inch flour tortilla with chicken or pork pastor and cheese, cut into 3. Option to add pineapple.", price: "$13.00", badge: "87% liked (8)", image: quesadillas },
  { category: "Quesadillas", name: "Carnitas Quesadilla", description: "Slow-cooked pork and melted cheese in a flour tortilla with guacamole, sour cream and pico de gallo.", price: "$13.00", image: quesadillas },
  { category: "Quesadillas", name: "Tripitas Quesadilla", description: "Grilled flour tortilla filled with jack cheese and beef tripas, with onions and cilantro.", price: "$14.00", image: quesadillas },
  { category: "Quesadillas", name: "Asada Quesadilla", description: "Grilled tortilla filled with seasoned beef and melted cheese, with lime, diced onions and cilantro. Served with salsa and creamy sauce.", price: "$14.00", badge: "87% liked (8)", image: quesadillas },
  { category: "Quesadillas", name: "Birria Quesadilla", description: "Tender birria-stuffed quesadilla with melted cheese, cilantro, onions, radish, lime and a side of rich consomé.", price: "$14.25", badge: "87% liked (8)", image: quesadillas },

  // Burritos
  { category: "Burritos", name: "Pastor Burrito Supreme", description: "Burrito filled with chicken or pork pastor, beans, rice, cheese, onion, tomato, cilantro, jalapeño and sour cream. Option to add pineapple.", price: "$12.50", image: burritoSupreme },
  { category: "Burritos", name: "Carnitas Burrito Supreme", description: "Tender carnitas wrapped with rice, beans, cheese and fresh pico de gallo. Served with lime and salsa.", price: "$12.50", image: burritoSupreme },
  { category: "Burritos", name: "Tripitas Burrito Supreme", description: "Burrito filled with seasoned tripitas, rice, beans, cheese and fresh vegetables. Served with lime and salsa.", price: "$13.00", image: burritoSupreme },
  { category: "Burritos", name: "Birria Burrito Supreme", description: "Tender birria beef wrapped with rice, beans, cheese and fresh vegetables in a grilled tortilla. Served with lime and salsa.", price: "$13.00", image: burritoSupreme },
  { category: "Burritos", name: "Asada Burrito Supreme", description: "Grilled tortilla filled with seasoned beef, rice, beans, cheese and fresh salsa. Served with lime and two salsas.", price: "$13.00", image: burritoSupreme },

  // Loaded Nachos
  { category: "Loaded Nachos", name: "Pastor Loaded Nachos", description: "Chicken or pork pastor nachos topped with nacho cheese, beans, jalapeños, cilantro, onion, tomato and sour cream. Option to add pineapple.", price: "$13.75", image: loadedNachos },
  { category: "Loaded Nachos", name: "Carnitas Loaded Nachos", description: "Tostadas topped with roasted carnitas, melted cheese, beans, pico de gallo, guacamole, sour cream and jalapeños.", price: "$13.75", image: loadedNachos },
  { category: "Loaded Nachos", name: "Tripitas Loaded Nachos", description: "Tripe over tostadas smothered in nacho cheese, with beans, jalapeños, pico de gallo, guacamole, sour cream and lettuce.", price: "$15.00", image: loadedNachos },
  { category: "Loaded Nachos", name: "Birria Loaded Nachos", description: "Tostadas topped with slow-cooked birria, melted cheese, beans, pico de gallo, jalapeños, guacamole and sour cream.", price: "$15.00", image: loadedNachos },
  { category: "Loaded Nachos", name: "Asada Loaded Nachos", description: "Grilled asada over crispy tostadas with beans, melted cheese and jalapeños, garnished with sour cream, pico de gallo and guacamole.", price: "$15.00", image: loadedNachos },

  // Loaded Fries
  { category: "Loaded Fries", name: "Tripita Loaded Fries", description: "Waffle fries topped with tripita, nacho cheese, guacamole, sour cream and fresh pico de gallo.", price: "$14.00", image: loadedFries },
  { category: "Loaded Fries", name: "Carnitas Loaded Fries", description: "Waffle fries topped with tender carnitas, nacho cheese, jalapeños, diced onions, cilantro, guacamole and sour cream.", price: "$13.50", image: loadedFries },
  { category: "Loaded Fries", name: "Pastor Loaded Fries", description: "Waffle fries topped with chicken or pork pastor, nacho cheese, onion, tomato, cilantro, jalapeño and sour cream. Optional pineapple.", price: "$13.50", image: loadedFries },
  { category: "Loaded Fries", name: "Asada Loaded Fries", description: "Waffle fries topped with carne asada, melted cheese, guacamole, pico de gallo and sour cream.", price: "$14.00", image: loadedFries },
  { category: "Loaded Fries", name: "Birria Loaded Fries", description: "Waffle fries topped with birria beef, cheese, guacamole, sour cream, onions and cilantro.", price: "$14.25", image: loadedFries },

  // Tortas
  { category: "Tortas", name: "Pastor Torta", description: "Torta bread with chicken or pork pastor and classic Mexican fillings. Optional pineapple.", price: "$12.50", image: tortas },
  { category: "Tortas", name: "Carnitas Torta", description: "Braised pork on Mexican bread with refried beans, lettuce, tomato, onion, avocado and mayo.", price: "$12.50", image: tortas },
  { category: "Tortas", name: "Tripitas Torta", description: "Beef tripe torta with refried beans, lettuce, tomato, avocado, cheese and mayo on fresh Mexican bread.", price: "$13.25", image: tortas },
  { category: "Tortas", name: "Birria Torta", description: "Shredded beef birria, refried beans, melted cheese, lettuce, tomato, onion and jalapeños on toasted telera with a hint of mayo.", price: "$13.75", image: tortas },
  { category: "Tortas", name: "Asada Torta", description: "Grilled steak, refried beans, lettuce, tomato, avocado, onions and mayo on traditional Mexican bread.", price: "$13.25", image: tortas },

  // Grilled Cheese
  { category: "Grilled Cheese", name: "Pastor Grilled Cheese", description: "Grilled Texas toast with American cheese and marinated chicken or pork pastor.", price: "$11.25", image: grilledCheese },
  { category: "Grilled Cheese", name: "Carnitas Grilled Cheese", description: "Slow-roasted shredded pork and melted cheese on grilled Texas toast.", price: "$11.25", image: grilledCheese },
  { category: "Grilled Cheese", name: "Tripitas Grilled Cheese", description: "Grilled Texas toast with crispy tripe and melted American cheese — a Mexican twist on a classic.", price: "$12.25", image: grilledCheese },
  { category: "Grilled Cheese", name: "Birria Grilled Cheese", description: "Birria and melted cheese on toasted Texas toast, garnished with onion and cilantro. Served with a side of consomé.", price: "$13.75", image: grilledCheese },
  { category: "Grilled Cheese", name: "Asada Grilled Cheese", description: "Grilled beef, melted American cheese, onions and cilantro on toasted Texas toast.", price: "$12.25", image: grilledCheese },

  // Ramen
  {
    category: "Ramen",
    name: "Birria Ramen",
    description: "House birria broth over ramen — rich, spicy, unforgettable.",
    image: birriaRamen,
  },

  // Extras & Sides
  {
    category: "Extras & Sides",
    name: "Rice and Beans",
    description: "Delicious rice and beans plate.",
    price: "$4.00",
    badge: "#3 Most Liked · 93% (15)",
    image: riceAndBeans,
  },
  { category: "Extras & Sides", name: "Rice", description: "Delicious Mexican red rice.", price: "$4.00", image: rice },
  { category: "Extras & Sides", name: "Beans", description: "Delicious refried beans served with cheese on top.", price: "$4.00", image: beans },
  {
    category: "Extras & Sides",
    name: "Guacamole (1.5 oz cup)",
    description: "Avocado, lime, red onion, cilantro and tomato.",
    price: "$1.00",
    badge: "100% liked (9)",
    image: guacamole,
  },
  { category: "Extras & Sides", name: "Corn Tortillas (2)", description: "Two warm corn tortillas.", price: "$2.00", image: cornTortillas },
  {
    category: "Extras & Sides",
    name: "8 oz Consomé",
    description: "Rich 8 oz birria consomé. Condiments sold separately.",
    price: "$4.00",
    badge: "81% liked (11)",
    image: consome,
  },
  {
    category: "Extras & Sides",
    name: "Condiments",
    description: "Extra side of lime, salsa, onion, cilantro and radishes.",
    price: "$1.00",
    badge: "#2 Most Liked · 95% (23)",
    image: condiments,
  },

  // Dessert
  { category: "Dessert", name: "Empanadas (2)", description: "Two crispy empanadas — sweet or savory filling.", price: "$2.50", image: empanadas },
  { category: "Dessert", name: "Tres Leches Cake", description: "Classic sponge cake soaked in three milks.", price: "$6.00", image: tresLeches },
  { category: "Dessert", name: "Flan", description: "Creamy caramel custard with a smooth finish.", price: "$6.00", image: flan },

  // Agua Fresca
  {
    category: "Agua Fresca",
    name: "Melon Water (Agua De Melon) (16 oz)",
    description: "16 oz refreshing melon agua fresca pouch.",
    image: aguaMelon,
  },
  {
    category: "Agua Fresca",
    name: "Strawberry Lemonade (16 oz)",
    description: "Refreshing strawberry lemonade juice pouch, 16 oz.",
    image: aguaStrawberry,
  },
  {
    category: "Agua Fresca",
    name: "Pistachio Water (Agua De Pistachio) (16 oz)",
    description: "Delicious 16 oz pistachio agua fresca pouch.",
    image: aguaPistachio,
  },
  {
    category: "Agua Fresca",
    name: "Jamaica Water (Agua De Jamaica) (16 oz)",
    description: "16 oz hibiscus agua de jamaica pouch.",
    image: aguaJamaica,
  },

  // Kids Meal
  {
    category: "Kids Meal",
    name: "Kids Quesadilla",
    description: "Cheese filled quesadilla served with rice and beans on the side.",
    price: "$8.00",
    image: kidsQuesadilla,
  },
  {
    category: "Kids Meal",
    name: "Bomba Nuggets",
    description: "6 crispy nuggets served with a side of waffle fries. Ketchup on the side.",
    price: "$8.00",
    image: kidsNuggets,
  },
  {
    category: "Kids Meal",
    name: "Kids Taco Plate",
    description: "2 Bomba tacos with Birria served with beans and rice on the side.",
    price: "$8.00",
    image: kidsTacoPlate,
  },
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
