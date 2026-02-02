import getPrismaClient from "./database.js";
import BookService from "../Services/BookService.js";
import BorrowerService from "../Services/BorrowerService.js";
import CheckoutService from "../Services/CheckoutService.js";
import ExportService from "../Services/ExportService.js";

class Container {
  constructor() {
    this.prisma = getPrismaClient();
    this.services = {};
  }

  getService(ServiceClass) {
    const serviceName = ServiceClass.name;
    
    if (!this.services[serviceName]) {
      this.services[serviceName] = new ServiceClass(this.prisma);
    }
    
    return this.services[serviceName];
  }

  getPrisma() {
    return this.prisma;
  }
}

const container = new Container();
export default container;
