import { getDefaultCredentials } from '../credentialUtil';

const { PAYPAL_SANDBOX_CLIENT_ID, PAYPAL_SANDBOX_CLIENT_SECRET } = getDefaultCredentials();

// PayPal 沙箱环境 API URL
const PAYPAL_API_URL = 'https://api-m.sandbox.paypal.com';

/**
 * 使用 fetch 创建 PayPal Order
 */
export async function createOrder(orderRequestBody: any) {
    // 使用 basic auth 获取 access token
    const auth = Buffer.from(
        `${PAYPAL_SANDBOX_CLIENT_ID}:${PAYPAL_SANDBOX_CLIENT_SECRET}`
    ).toString('base64');

   

    // 使用 token 创建订单
    const orderResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`,
        },
        body: JSON.stringify(orderRequestBody),
    });

    if (!orderResponse.ok) {
        throw new Error(`创建订单失败: ${orderResponse.status}`);
    }

    const orderData = await orderResponse.json();
    return {
        jsonResponse: orderData,
        httpStatusCode: orderResponse.status,
    };
}

export async function createOrderWithSampleDataAppSwitch(returnUrl: string, cancelUrl: string) {

    const orderRequestBody = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": "USD",
                    "value": "149.95",
                    "breakdown": {
                        "item_total": {
                            "currency_code": "USD",
                            "value": "149.95"
                        }
                    }
                },
                "items": [
                    {
                        "name": "Test Product",
                        "unit_amount": {
                            "currency_code": "USD",
                            "value": "29.99"
                        },
                        "quantity": "5",
                        "sku": "test-product-1"
                    }
                ],
                "shipping": {
                    "type": 'SHIPPING',
                    "method": "DHL",
                    "name": {
                        "full_name": "John Doe"
                    },
                    "address": {
                        "address_line1": "1600 Amphitheatre Parkway",
                        "address_line2": "Suite 100",
                        "postal_code": "94043",
                        "admin_area2": "Mountain View",
                        "country_code": "US",
                        "admin_area1": "CA"
                    }
                }
            }
        ],
        "payment_source": {
            "paypal": {
                "experience_context": {
                    "payment_method_preference": "IMMEDIATE_PAYMENT_REQUIRED",
                    "brand_name": "EXAMPLE INC",
                    "locale": "en-US",
                    "landing_page": "LOGIN",
                    "shipping_preference": 'SET_PROVIDED_ADDRESS',
                    "user_action": 'PAY_NOW',
                    "return_url": returnUrl,
                    "cancel_url": cancelUrl,
                    "app_switch_context": {
                        "launch_paypal_app": true
                    }
                },
                "name": {
                    "given_name": "John",
                    "surname": "Doe"
                },

                "address": {
                    "address_line1": "1600 Amphitheatre Parkway",
                    "address_line2": "Suite 100",
                    "postal_code": "94043",
                    "admin_area2": "Mountain View",
                    "country_code": "US",
                    "admin_area1": "CA"
                },

                "email_address": "test@test.com",
                "phone": {
                    "phone_type": 'HOME',
                    "phone_number": {
                        "national_number": "4085551234"
                    }
                }
            }
        }
    }

    return await createOrder(orderRequestBody);
}
