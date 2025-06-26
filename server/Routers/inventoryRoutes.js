import express from "express";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";
import allow from "../middleWare/accessAllow.js";
import role from "../utils/roles.js";
import { addNewInventoryItem, deleteInventoryItem, getAllInventory, updateInventoryItem } from "../controllers/inventoryController.js";
const router = express.Router();

//http://localhost:4000/inventory/...

router.get("/items", checkAuth, allow(role.Admin, role.Receptionist), getAllInventory);


router.post("/items", checkAuth, allow(role.Admin, role.Receptionist), addNewInventoryItem);

router.patch("/item/:id", checkAuth, allow(role.Admin, role.Receptionist), updateInventoryItem);

router.delete("/item/:id", checkAuth, allow(role.Admin, role.Receptionist), deleteInventoryItem);


export default router;