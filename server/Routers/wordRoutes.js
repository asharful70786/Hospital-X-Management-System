import express from "express";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";
import allow from "../middleWare/accessAllow.js";
import role from "../utils/roles.js";
import Ward from "../Models/Ward.js";
// import { addWord, deleteWord, getAllWords, updateWord } from "../controllers/wordController.js";

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const words = await Ward.find();
    res.status(200).json(words);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});

export default router;