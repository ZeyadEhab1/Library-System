import express from "express";
import JobController from "../Controllers/JobController.js";

const router = express.Router();

router.post(
  "/update-overdue-checkouts",
  JobController.updateOverdueCheckouts.bind(JobController)
);

export default router;
