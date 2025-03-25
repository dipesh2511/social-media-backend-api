import mongoose from "mongoose";

const mongodbUri = process.env.MONGO_DB_URI;
export const mongodbConnect = async () => {
    try {
        await mongoose.connect(mongodbUri,{
            dbName:process.env.DATA_BASE_NAME
        })
        console.log(`Mongo db is connect to uri ${mongodbUri}`);
    } catch (error) {
        console.log(error);
    }
};
