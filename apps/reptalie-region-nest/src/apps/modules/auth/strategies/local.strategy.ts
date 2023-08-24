import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: 'userId',
            passwordField: 'password',
            passReqToCallback: false,
        });
    }

    async validate(userId: string, password: string) {
        const user = await this.authService.signIn({ userId, password });
        if (user === null) {
            throw new UnauthorizedException('Invalid credentials. Please check your email and password.');
        }

        return user;
    }
}
