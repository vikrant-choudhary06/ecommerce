require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const seedProducts = [
  // SHIRTS //
  {
    image: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=500&q=80",
    title: "Classic Oxford Cotton Shirt",
    description: "A versatile oxford shirt perfect for any occasion.",
    category: "shirts",
    brand: "levi",
    price: 65,
    salePrice: 50,
    totalStock: 100,
    averageReview: 4.5,
  },
  {
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
    title: "Premium Essential T-Shirt",
    description: "Everyday essential crewneck t-shirt.",
    category: "shirts",
    brand: "zara",
    price: 25,
    salePrice: 20,
    totalStock: 250,
    averageReview: 4.8,
  },
  {
    image: "https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=500&q=80",
    title: "Relaxed Fit Linen Shirt",
    description: "Breathable pure linen shirt for warm weather.",
    category: "shirts",
    brand: "h&m",
    price: 45,
    salePrice: 0,
    totalStock: 150,
    averageReview: 4.2,
  },
  {
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80",
    title: "Vintage Logo Graphic Tee",
    description: "Soft cotton tee with classic emblem graphic.",
    category: "shirts",
    brand: "puma",
    price: 35,
    salePrice: 25,
    totalStock: 200,
    averageReview: 4.6,
  },
  
  // PANTS & JEANS //
  {
    image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=500&q=80",
    title: "Slim Fit Denim Jeans",
    description: "Classic slim fit denim jeans with a slightly tapered leg.",
    category: "pants",
    brand: "levi",
    price: 89,
    salePrice: 75,
    totalStock: 80,
    averageReview: 4.7,
  },
  {
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80",
    title: "Tech-Fleece Jogger Pants",
    description: "Engineered fleece joggers for maximum comfort.",
    category: "pants",
    brand: "nike",
    price: 110,
    salePrice: 90,
    totalStock: 120,
    averageReview: 4.9,
  },
  {
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80",
    title: "Everyday Chino Pants",
    description: "Versatile, smart-casual chinos built for the office.",
    category: "pants",
    brand: "zara",
    price: 60,
    salePrice: 0,
    totalStock: 90,
    averageReview: 4.3,
  },
  {
    image: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=500&q=80",
    title: "Straight Leg 501s",
    description: "The original straight fit jean.",
    category: "pants",
    brand: "levi",
    price: 98,
    salePrice: 85,
    totalStock: 150,
    averageReview: 4.8,
  },

  // OUTERWEAR //
  {
    image: "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=500&q=80",
    title: "Harrington Jacket",
    description: "Lightweight and stylish harrington jacket.",
    category: "outerwear",
    brand: "h&m",
    price: 120,
    salePrice: 0,
    totalStock: 45,
    averageReview: 4.2,
  },
  {
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80",
    title: "Winter Puffer Coat",
    description: "Stay warm with this heavy duty puffer.",
    category: "outerwear",
    brand: "nike",
    price: 180,
    salePrice: 150,
    totalStock: 30,
    averageReview: 4.9,
  },
  {
    image: "https://images.unsplash.com/photo-1520975954732-57dd22299614?w=500&q=80",
    title: "Windbreaker Sprint Jacket",
    description: "Waterproof running jacket.",
    category: "outerwear",
    brand: "adidas",
    price: 130,
    salePrice: 105,
    totalStock: 75,
    averageReview: 4.6,
  },
  {
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80",
    title: "Moto Leather Jacket",
    description: "Genuine leather jacket with asymmetric zip.",
    category: "outerwear",
    brand: "zara",
    price: 299,
    salePrice: 250,
    totalStock: 25,
    averageReview: 4.7,
  },

  // ACCESSORIES //
  {
    image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=500&q=80",
    title: "Chronograph Leather Watch",
    description: "Elegant and minimal leather watch.",
    category: "accessories",
    brand: "zara",
    price: 140,
    salePrice: 0,
    totalStock: 50,
    averageReview: 4.6,
  },
  {
    image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=500&q=80",
    title: "Canvas Weekender Bag",
    description: "Perfect for a quick trip away.",
    category: "accessories",
    brand: "puma",
    price: 85,
    salePrice: 70,
    totalStock: 25,
    averageReview: 4.3,
  },
  {
    image: "https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=500&q=80",
    title: "Textured Leather Belt",
    description: "Handcrafted 100% genuine full-grain leather belt.",
    category: "accessories",
    brand: "levi",
    price: 45,
    salePrice: 0,
    totalStock: 100,
    averageReview: 4.8,
  },
  {
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80",
    title: "Aviator Sunglasses",
    description: "Classic tinted aviators with UV400 protection.",
    category: "accessories",
    brand: "h&m",
    price: 25,
    salePrice: 18,
    totalStock: 200,
    averageReview: 4.4,
  },

  // FOOTWEAR //
  {
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80",
    title: "Urban Elite Sneakers",
    description: "Comfortable and stylish sneakers for everyday wear.",
    category: "footwear",
    brand: "adidas",
    price: 130,
    salePrice: 110,
    totalStock: 120,
    averageReview: 4.8,
  },
  {
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80",
    title: "Leather Dress Shoes",
    description: "Formal leather shoes for your next event.",
    category: "footwear",
    brand: "zara",
    price: 160,
    salePrice: 0,
    totalStock: 60,
    averageReview: 4.5,
  },
  {
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80",
    title: "Air Max Performance Runners",
    description: "Cushioned, lightweight long-distance runners.",
    category: "footwear",
    brand: "nike",
    price: 180,
    salePrice: 155,
    totalStock: 200,
    averageReview: 4.9,
  },
  {
    image: "https://images.unsplash.com/photo-1520316587275-5e4f06f68971?w=500&q=80",
    title: "Classic High-Top Canvas Shoes",
    description: "Timeless rubber and canvas sneakers.",
    category: "footwear",
    brand: "puma",
    price: 65,
    salePrice: 50,
    totalStock: 300,
    averageReview: 4.6,
  }
];

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("MongoDB connected");
    // Clear out the old products to avoid duplicates and non-men's items
    await Product.deleteMany({});
    console.log("Cleared old products");
    
    await Product.insertMany(seedProducts);
    console.log("Successfully seeded", seedProducts.length, "beautiful men's products");
    process.exit();
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
