const Item = require('../models/Item');

// GET all items
const getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST a new item
const createItem = async (req, res) => {
  const { title, description, category, type, location, locationCoords, contactEmail, contactPhone, reward } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

  const newItem = new Item({
    title,
    description,
    category,
    type,
    location,
    locationCoords,
    contactEmail,
    contactPhone,
    reward,
    imageUrl,
    status: 'active',
  });

  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getItems, createItem };
