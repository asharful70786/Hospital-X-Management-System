import InventoryItem from "../Models/InventoryItem.js";

export const getAllInventory = async (req, res) => {
  try {
    const items = await InventoryItem.find({});

    return res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export  const addNewInventoryItem = async (req, res) => {
  try {
    const newItem = new InventoryItem(req.body);
    await newItem.save();
    return res.status(201).json({ message: "Item added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const updateInventoryItem = async (req, res) => {
  //maybe i can send id  as req.body in  frontend applied time 
  const { id } = req.params;
  
  try {
    const updatedItem = await InventoryItem.findByIdAndUpdate(id, req.body, { new: true });
    return res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const deleteInventoryItem = async (req, res) => {
  console.log(req.params.id);
  try {
    await InventoryItem.findByIdAndDelete(req.params.id);
    return res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}