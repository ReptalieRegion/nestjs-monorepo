import { MongooseModule } from '@nestjs/mongoose';

export const CustomMongooseModule = MongooseModule.forRoot(process.env.MONGODB_URI ?? '', {
    dbName: 'reptalie-region',
});
