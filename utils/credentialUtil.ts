import dotenv from 'dotenv';

export const getDefaultCredentials = () => {
    dotenv.config();
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const secretKey = process.env.PAYPAL_SECRET;
    const DOMAINS = process.env.FASTLANE_DOMAIN;
    return {
        PAYPAL_SANDBOX_CLIENT_ID: clientId,
        PAYPAL_SANDBOX_CLIENT_SECRET: secretKey,
        DOMAINS
    }
}