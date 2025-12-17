import { VercelRequest, VercelResponse } from '@vercel/node';
import { getBrowserSafeClientToken } from '../../../utils/paypalFnUtil';


export default async function handler(req: VercelRequest, res: VercelResponse) {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.send('Hello from Vercel TS!');
    // 处理OPTIONS预检请求
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { jsonResponse, httpStatusCode } =
            await getBrowserSafeClientToken();
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create browser safe access token:", error);
        res
            .status(500)
            .json({ error: "Failed to create browser safe access token." });
    }



}