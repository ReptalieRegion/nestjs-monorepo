import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService, AuthServiceToken } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(AuthServiceToken)
        private authService: AuthService,
    ) {
        super({ usernameField: 'email' });
    }

    async validate(email: string, password: string) {
        return this.authService.validateUser(email, password);
    }
}
