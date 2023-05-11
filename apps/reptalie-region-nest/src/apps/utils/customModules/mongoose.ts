import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from '../../schemas/user.schema';

export const CustomMongooseModule = MongooseModule.forRoot(process.env.MONGODB_URI ?? '', {
    dbName: 'reptalie-region',
});

export const MongooseModuleUser = MongooseModule.forFeature([{ name: User.name, schema: userSchema }]);
