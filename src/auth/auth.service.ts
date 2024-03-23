import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthEntity> {
    const decodedToken = this.jwtService.verify(refreshToken, {
      ignoreExpiration: true,
    });

    if (!decodedToken || !decodedToken.userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: decodedToken.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  private generateRefreshToken(userId: number): string {
    return this.jwtService.sign({ userId }, { expiresIn: '7d' });
  }
}
