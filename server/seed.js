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
