import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/UserRepository';
import { IUser } from '../models/User';
import RefreshToken from '../models/RefreshToken';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private userRepo: UserRepository;
  private readonly jwtSecret: string;
  private readonly refreshTokenSecret: string;

  constructor() {
    this.userRepo = new UserRepository();
    this.jwtSecret = process.env.JWT_SECRET || 'supersecret';
    this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'refreshsecret';
  }

  async register(name: string, email: string, password: string): Promise<AuthTokens> {
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.userRepo.create({ name, email, passwordHash });
    
    return this.generateTokens(user._id.toString());
  }

  async login(email: string, password: string): Promise<AuthTokens> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    return this.generateTokens(user._id.toString());
  }

  private async generateTokens(userId: string): Promise<AuthTokens> {
    const accessToken = jwt.sign({ userId }, this.jwtSecret, { expiresIn: '1h' });
    const refreshTokenValue = jwt.sign({ userId }, this.refreshTokenSecret, { expiresIn: '7d' });

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    await RefreshToken.create({
      user: userId,
      token: refreshTokenValue,
      expiresAt: expiresAt
    });

    return { accessToken, refreshToken: refreshTokenValue };
  }

  async refreshToken(tokenValue: string): Promise<AuthTokens> {
    const storedToken = await RefreshToken.findOne({ token: tokenValue }).exec();
    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    const decoded: any = jwt.verify(tokenValue, this.refreshTokenSecret);
    const userId = decoded.userId;

    // Delete old token
    await RefreshToken.deleteOne({ _id: storedToken._id });

    return this.generateTokens(userId);
  }

  async logout(tokenValue: string): Promise<void> {
    await RefreshToken.deleteOne({ token: tokenValue });
  }
}
