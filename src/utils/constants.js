import dotenv from 'dotenv';
dotenv.config();

export const DB_CONNECT = process.env.MONGOAPI

export const JWT_TOKEN_SECRET="skkdkjhdkih"

export const StatusCode={
    SUCCESS:200,
    VALIDATION_ERROR:201,
    UNPROCESSABLE_ENTITY:202,
}
