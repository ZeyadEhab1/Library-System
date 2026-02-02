import BorrowerService from "../Services/BorrowerService.js";
import container from "../config/container.js";

class BorrowerController {
  constructor() {
    this.borrowerService = container.getService(BorrowerService);
  }

  async update(req, res, next) {
    try {
      const updated = await this.borrowerService.updateBorrower(req.user.id, req.body);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await this.borrowerService.deleteBorrower(req.user.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async listAll(req, res, next) {
    try {
      const borrowers = await this.borrowerService.getAllBorrowers();
      res.json(borrowers);
    } catch (err) {
      next(err);
    }
  }
}

export default new BorrowerController();
