import express from "express";
import {
  registerForEvent,
  unregisterFromEvent,
  getMyRegistrations,
  getEventRegistrations,
} from "../controllers/registrationController";
import { protect, organizerOnly } from "../middleware/authMiddleware";

const router = express.Router();

// route bindings
router.post("/register", protect, (req, res, next) => {
  registerForEvent(req, res).catch(next);
});
router.post("/unregister", protect, (req, res, next) => {
  unregisterFromEvent(req, res).catch(next);
});
router.get("/my", protect, (req, res, next) => {
  getMyRegistrations(req, res).catch(next);
});

router.get("/event/:id", protect, organizerOnly, (req, res, next) => {
  getEventRegistrations(req, res).catch(next);
});

export default router;
