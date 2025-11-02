import express from "express";
import {
  getResep,
  createResep,
  updateResep,
  softDeleteResep
} from "../controllers/resepController.js";

const router = express.Router();

router.get("/", getResep);
router.post("/", createResep);
router.put("/:id", updateResep);
router.delete("/:id", softDeleteResep);

export default router;
