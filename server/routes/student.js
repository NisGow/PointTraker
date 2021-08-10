import express, { response } from "express";

import { getStudents } from "../controllers/student.js";

const router = express.Router();

router.get("/posts", getStudents);

export default router;
