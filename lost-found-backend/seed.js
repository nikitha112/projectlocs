require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('./models/item'); // Your Mongoose model

// Sample data
const items = [
  {
    title: "Lost Wallet",
    description: "Black leather wallet lost near park",
    category: "Accessories",
    type: "lost",
    location: "City Park",
    locationCoords: [12.9716, 77.5946], // Example lat,lng
    contactEmail: "user1@example.com",
    contactPhone: "1234567890",
    reward: 50,
    imageUrl: "", // leave blank or put a URL
  },
  {
    title: "Found Keys",
    description: "Set of car keys found on Main Street",
    category: "Keys",
    type: "found",
    location: "Main Street",
    locationCoords: [12.9720, 77.5950],
    contactEmail: "user2@example.com",
    contactPhone: "0987654321",
    reward: 0,
    imageUrl: "",
  }
];

// Connect to DB and insert
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");

    await Item.deleteMany({}); // Optional: clears existing items
    await Item.insertMany(items);
    console.log("Database seeded successfully");

    mongoose.disconnect();
  } catch (err) {
    console.error("Error seeding DB:", err);
  }
};

seedDB();
