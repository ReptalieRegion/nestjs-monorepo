import { JwtModule } from '@nestjs/jwt';

export const CustomJwtModule = JwtModule.register({
    secret: process.env.JWT_SECRET_KEY,
    signOptions: {
        algorithm: 'HS512',
    },
    verifyOptions: {
        algorithms: ['HS512'],
    },
});
