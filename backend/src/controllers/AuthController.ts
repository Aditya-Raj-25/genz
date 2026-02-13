import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const tokens = await this.authService.register(name, email, password);
      res.status(201).json(tokens);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const tokens = await this.authService.login(email, password);
      res.json(tokens);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  refresh = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      const tokens = await this.authService.refreshToken(refreshToken);
      res.json(tokens);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  logout = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      await this.authService.logout(refreshToken);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
