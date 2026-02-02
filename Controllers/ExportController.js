import ExportService from "../Services/ExportService.js";
import container from "../config/container.js";
import { createObjectCsvWriter } from "csv-writer";
import fs from "fs";

class ExportController {
  constructor() {
    this.exportService = container.getService(ExportService);
  }

  formatCheckoutData(checkouts) {
    return checkouts.map(checkout => ({
      'Checkout ID': checkout.id,
      'Book Title': checkout.book.title,
      'Book Author': checkout.book.author,
      'ISBN': checkout.book.isbn,
      'Borrower Name': checkout.borrower.name,
      'Borrower Email': checkout.borrower.email,
      'Borrower Phone': checkout.borrower.phone || 'N/A',
      'Borrowed Date': checkout.borrowed_at.toISOString().split('T')[0],
      'Due Date': checkout.due_date.toISOString().split('T')[0],
      'Returned Date': checkout.returned_at ? checkout.returned_at.toISOString().split('T')[0] : 'Not Returned',
      'Status': checkout.status,
      'Days Overdue': checkout.returned_at 
        ? null 
        : (new Date() > new Date(checkout.due_date) 
            ? Math.floor((new Date() - new Date(checkout.due_date)) / (1000 * 60 * 60 * 24))
            : 0)
    }));
  }

  async generateCSV(data, filename) {
    const csvWriter = createObjectCsvWriter({
      path: filename,
      header: [
        { id: 'Checkout ID', title: 'Checkout ID' },
        { id: 'Book Title', title: 'Book Title' },
        { id: 'Book Author', title: 'Book Author' },
        { id: 'ISBN', title: 'ISBN' },
        { id: 'Borrower Name', title: 'Borrower Name' },
        { id: 'Borrower Email', title: 'Borrower Email' },
        { id: 'Borrower Phone', title: 'Borrower Phone' },
        { id: 'Borrowed Date', title: 'Borrowed Date' },
        { id: 'Due Date', title: 'Due Date' },
        { id: 'Returned Date', title: 'Returned Date' },
        { id: 'Status', title: 'Status' },
        { id: 'Days Overdue', title: 'Days Overdue' }
      ]
    });

    await csvWriter.writeRecords(data);
    return filename;
  }

  async getAnalyticalReport(req, res, next) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({ 
          error: 'startDate and endDate query parameters are required (format: YYYY-MM-DD)' 
        });
      }

      const report = await this.exportService.getAnalyticalReport(startDate, endDate);
      res.json(report);
    } catch (err) {
      next(err);
    }
  }

  async exportBorrowingProcessesByPeriod(req, res, next) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({ 
          error: 'startDate and endDate query parameters are required (format: YYYY-MM-DD)' 
        });
      }

      const checkouts = await this.exportService.getBorrowingProcessesByPeriod(startDate, endDate);
      const formattedData = this.formatCheckoutData(checkouts);

      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `borrowing_processes_${startDate}_to_${endDate}_${timestamp}.csv`;

      await this.generateCSV(formattedData, filename);
      res.download(filename, filename, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
        }
        // Clean up file after download
        fs.unlinkSync(filename);
      });
    } catch (err) {
      next(err);
    }
  }

  async exportOverdueBorrowsLastMonth(req, res, next) {
    try {
      const checkouts = await this.exportService.getOverdueBorrowsLastMonth();
      const formattedData = this.formatCheckoutData(checkouts);

      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `overdue_borrows_last_month_${timestamp}.csv`;

      await this.generateCSV(formattedData, filename);
      res.download(filename, filename, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
        }
        // Clean up file after download
        fs.unlinkSync(filename);
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Export all borrowing processes of the last month
   */
  async exportAllBorrowingProcessesLastMonth(req, res, next) {
    try {
      const checkouts = await this.exportService.getAllBorrowingProcessesLastMonth();
      const formattedData = this.formatCheckoutData(checkouts);

      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `all_borrowing_processes_last_month_${timestamp}.csv`;

      await this.generateCSV(formattedData, filename);
      res.download(filename, filename, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
        }
        // Clean up file after download
        fs.unlinkSync(filename);
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new ExportController();
