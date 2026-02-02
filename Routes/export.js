import express from "express";
import ExportController from "../Controllers/ExportController.js";
import { validate } from "../middleware/validation.js";
import { exportSchemas } from "../validators/schemas.js";

const router = express.Router();

router.get(
  "/report",
  validate(exportSchemas.period, 'query'),
  ExportController.getAnalyticalReport.bind(ExportController)
);

// Export borrowing processes in a specific period (CSV)
router.get(
  "/export/period",
  validate(exportSchemas.period, 'query'),
  ExportController.exportBorrowingProcessesByPeriod.bind(ExportController)
);

// Export all overdue borrows of the last month (CSV)
router.get(
  "/export/overdue-last-month",
  ExportController.exportOverdueBorrowsLastMonth.bind(ExportController)
);

// Export all borrowing processes of the last month (CSV)
router.get(
  "/export/all-last-month",
  ExportController.exportAllBorrowingProcessesLastMonth.bind(ExportController)
);

export default router;
