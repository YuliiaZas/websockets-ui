import dotenv from 'dotenv';
dotenv.config({ path: `.env/${process.env.NODE_ENV}` })

export const getPort = () => process.env.HTTP_PORT;