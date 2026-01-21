import { VercelRequest, VercelResponse } from '@vercel/node';
import { getBrowserSafeClientToken, getLiveBrowserSafeClientToken } from '../../utils/paypalFnUtil';


export default async function handler(req: VercelRequest, res: VercelResponse) {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 处理OPTIONS预检请求
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const clientId =
        "AVmKF-CgqAXcDEMvjXUnw1kR-z9kwv-jl2Gc0uR45EwoW2QUk9FcAReTqLn15NvKkCWHIC2FddzS2dYe";
    const clientSecret =
        "EPp3435O8SEHjS6oCQnAID8_RXkyfk0xnNnyF79qG25TChgElC2kqw90MHK2dqqA0jWjRDcnUjirMG-F";

    try {
        const { jsonResponse, httpStatusCode } =
            await getLiveBrowserSafeClientToken(clientId, clientSecret);
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create browser safe access token:", error);
        res
            .status(500)
            .json({ error: "Failed to create browser safe access token." });
    }

}