import CheckoutService from "../Services/CheckoutService.js";
import container from "../config/container.js";
import updateOverdueCheckouts from "../jobs/updateOverdueCheckouts.js";

class JobController {
  constructor() {
    this.checkoutService = container.getService(CheckoutService);
  }

  async updateOverdueCheckouts(req, res, next) {
    try {
      const result = await updateOverdueCheckouts();
      res.json({
        message: 'Overdue checkouts update job completed successfully',
        result
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new JobController();
