import { Module } from "@nestjs/common";
import { MongooseModule, MongooseModuleOptions } from "@nestjs/mongoose";

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: async (): Promise<MongooseModuleOptions> => ({
                uri: process.env.MONGO_URI,
            })
        })
    ]
})

export class MongoModule {}