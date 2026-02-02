import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import BorrowerService from "../Services/BorrowerService.js";
import container from "../config/container.js";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

class AuthController {
  constructor() {
    this.borrowerService = container.getService(BorrowerService);
  }

  async register(req, res, next) {
    try {
      const { name, email, password, phone } = req.body;
      
      const existingUser = await this.borrowerService.getBorrowerByEmail(email);
      
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
      
      const user = await this.borrowerService.createBorrower({
        name,
        email,
        password,
        phone
      });
      
      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.status(201).json({
        message: 'User created successfully',
        token,
        user
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      const user = await this.borrowerService.getBorrowerByEmail(email);
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
