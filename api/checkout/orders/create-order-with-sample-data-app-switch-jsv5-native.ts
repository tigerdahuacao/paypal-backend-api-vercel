import { VercelRequest, VercelResponse } from '@vercel/node';
import { createOrderWithSampleDataAppSwitch } from '../../../utils/createOrderScenario/orderFn';


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
        const returnUrl = req.body ? req.body["returnUrl"] : ""
        const cancelUrl = req.body ? req.body["cancelUrl"] : ""
        const { jsonResponse, httpStatusCode } =
            await createOrderWithSampleDataAppSwitch(returnUrl, cancelUrl);
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to create order." });
    }


}