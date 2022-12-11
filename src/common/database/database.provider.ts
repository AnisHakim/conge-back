import * as mongoose from "mongoose";
import { DB_PROVIDER } from "src/common/Config/config";
export const DataBaseProviders = [
    {
        provide: DB_PROVIDER,
        useFactory: async () => {
            (mongoose as any).Promise = global.Promise;
            return await mongoose.connect(
                process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
            )
        }
    }
]
