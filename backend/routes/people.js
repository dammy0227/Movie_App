import express from "express";
const router = express.Router();
import { 
  searchPerson, 
  personDetails, 
  popularPeople 
} from "../controllers/peopleController.js";

router.get("/search", searchPerson);
router.get("/popular", popularPeople);
router.get("/details/:personId", personDetails);

export default router;