import express from "express";
import InventoryItem from "../Models/InventoryItem.js";
const router = express.Router();

//http://localhost:4000/inventory/...

router.get("/items", async (req, res) => {
  try {
    const items = await InventoryItem.find({});
    //after create all model i can use populate and fetch user info if needed 
    return res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/items", async (req, res) => {
  try {
    const newItem = new InventoryItem(req.body);
    await newItem.save();
    return res.status(201).json({ message: "Item added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/item/:id", async (req, res) => {
  //maybe i can send id  as req.body in  frontend applied time 
  const { id } = req.params;
  console.log(id);
  try {
    const updatedItem = await InventoryItem.findByIdAndUpdate(id, req.body, { new: true });
    return res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/item/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    await InventoryItem.findByIdAndDelete(req.params.id);
    return res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;