
import { VercelRequest, VercelResponse } from '@vercel/node';
import { captureOrder, getOrder } from '../../../../utils/paypalFnUtil';


export default async function handler(req: VercelRequest, res: VercelResponse) {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');


    // 处理OPTIONS预检请求
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const orderIdParam = req.query.orderId;
        const orderId = Array.isArray(orderIdParam) ? orderIdParam[0] : orderIdParam;
        if (!orderId) {
            return res.status(400).json({ error: 'Missing orderId' });
        }
        const { jsonResponse, httpStatusCode } = await getOrder(orderId);
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to get order:", error);
        res.status(500).json({ error: "Failed to get order." });
    }

}