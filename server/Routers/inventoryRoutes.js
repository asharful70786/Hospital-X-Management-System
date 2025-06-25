import express from "express";
import InventoryItem from "../Models/InventoryItem.js";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";
import { addNewInventoryItem, deleteInventoryItem, getAllInventory, updateInventoryItem } from "../controllers/inventoryController.js";
const router = express.Router();

//http://localhost:4000/inventory/...

router.get("/items", checkAuth, getAllInventory);


router.post("/items", checkAuth, addNewInventoryItem);

router.patch("/item/:id", checkAuth, updateInventoryItem);

router.delete("/item/:id", checkAuth, deleteInventoryItem);


export default router;