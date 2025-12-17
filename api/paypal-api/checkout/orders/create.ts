import { createOrder } from "../../../../utils/paypalFnUtil";
import { VercelRequest, VercelResponse } from '@vercel/node';


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
      const paypalRequestId = req.headers["paypal-request-id"]?.toString();
      const { jsonResponse, httpStatusCode } = await createOrder({
        orderRequestBody: req.body,
        paypalRequestId,
      });
      res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
      console.error("Failed to create order:", error);
      res.status(500).json({ error: "Failed to create order." });
    }



}