import { Router } from "express";
import ArticuleController from "../controllers/articules.controller.js";

const router = Router();

router.get("/", ArticuleController.getArticules);

router.get("/amount", ArticuleController.getByAmount);

router.get("/:articuleID", ArticuleController.getById);

router.get("/name/:articuleName", ArticuleController.getByName);

router.post("/", ArticuleController.addArticule);

router.put("/:articuleID", ArticuleController.updateArticule);

router.delete("/:articuleID", ArticuleController.deleteArticule);

export default router;
