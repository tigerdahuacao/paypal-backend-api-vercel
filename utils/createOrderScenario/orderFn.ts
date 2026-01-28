import {
    ApiError,
    CheckoutPaymentIntent,
    Client,
    CustomError,
    Environment,
    FulfillmentType,
    LogLevel,
    OAuthAuthorizationController,
    OrderRequest,
    OrdersController,
    PaypalExperienceUserAction,
    PaypalPaymentTokenUsageType,
    PaypalWalletContextShippingPreference,
    PhoneType,
    VaultController,
    VaultInstructionAction,
    VaultTokenRequestType,
} from "@paypal/paypal-server-sdk";
import { ordersController } from "../paypalFnUtil";

/* ######################################################################
 * Process orders
 * ###################################################################### */

export async function createOrder({
    orderRequestBody,
    paypalRequestId,
}: {
    orderRequestBody: OrderRequest;
    paypalRequestId?: string;
}) {
    try {
        const { result, statusCode } = await ordersController.createOrder({
            body: orderRequestBody,
            paypalRequestId,
            prefer: "return=minimal",
        });

        return {
            jsonResponse: result,
            httpStatusCode: statusCode,
        };
    } catch (error) {
        if (error instanceof ApiError) {
            const { result, statusCode } = error;
            return {
                jsonResponse: result as CustomError,
                httpStatusCode: statusCode,
            };
        } else {
            throw error;
        }
    }
}


/* ######################################################################
 * Create orders with Basic Sample Data
 * ###################################################################### */

export async function createOrderWithSampleData() {
    const orderRequestBody = {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
            {
                amount: {
                    currencyCode: "USD",
                    value: "100.00",
                },
            },
        ],
    };
    return createOrder({ orderRequestBody });
}



export async function createOrderBCDCInline(returnUrl?: string) {


    const orderRequestBody = {
        "intent": CheckoutPaymentIntent.Capture,
        "purchaseUnits": [
            {
                "amount": {
                    "currencyCode": "USD",
                    "value": "149.95",
                    "breakdown": {
                        "itemTotal": {
                            "currencyCode": "USD",
                            "value": "149.95"
                        }
                    }
                },
                "items": [
                    {
                        "name": "Test Product",
                        "unitAmount": {
                            "currencyCode": "USD",
                            "value": "29.99"
                        },
                        "quantity": "5",
                        "sku": "test-product-1"
                    }
                ],
                "shipping": {
                    "type": FulfillmentType.Shipping,
                    "method": "DHL",
                    "name": {
                        "fullName": "John Doe"
                    },
                    "address": {
                        "addressLine1": "1600 Amphitheatre Parkway",
                        "addressLine2": "Suite 100",
                        "postalCode": "94043",
                        "adminArea2": "Mountain View",
                        "countryCode": "US",
                        "adminArea1": "CA"
                    }
                }
            }
        ],
        "payment_source": {
            "paypal": {
                "experience_context": {
                    "paymentMethodPreference": "IMMEDIATE_PAYMENT_REQUIRED",
                    "brandName": "EXAMPLE INC",
                    "locale": "en-US",
                    "landingPage": "LOGIN",
                    "shippingPreference": PaypalWalletContextShippingPreference.SetProvidedAddress,
                    "userAction": PaypalExperienceUserAction.PayNow,
                    "returnUrl": returnUrl ? returnUrl : "http://localhost:3000/return-url",
                    "cancelUrl": "http://localhost:3000/return-url"
                },
                "name": {
                    "givenName": "John",
                    "surname": "Doe"
                },

                "address": {
                    "addressLine1": "1600 Amphitheatre Parkway",
                    "addressLine2": "Suite 100",
                    "postalCode": "94043",
                    "adminArea2": "Mountain View",
                    "countryCode": "US",
                    "adminArea1": "CA"
                },

                "emailAddress": "test@test.com",
                "phone": {
                    "phoneType": PhoneType.Home,
                    "phoneNumber": {
                        "national_number": "4085551234"
                    }
                }
            }
        }
    }
    return createOrder({ orderRequestBody });
}




export async function createOrderWithSampleDataAppSwitch(returnUrl: string, cancelUrl: string) {


    const orderRequestBody = {
        "intent": CheckoutPaymentIntent.Capture,
        "purchaseUnits": [
            {
                "amount": {
                    "currencyCode": "USD",
                    "value": "149.95",
                    "breakdown": {
                        "itemTotal": {
                            "currencyCode": "USD",
                            "value": "149.95"
                        }
                    }
                },
                "items": [
                    {
                        "name": "Test Product",
                        "unitAmount": {
                            "currencyCode": "USD",
                            "value": "29.99"
                        },
                        "quantity": "5",
                        "sku": "test-product-1"
                    }
                ],
                "shipping": {
                    "type": FulfillmentType.Shipping,
                    "method": "DHL",
                    "name": {
                        "fullName": "John Doe"
                    },
                    "address": {
                        "addressLine1": "1600 Amphitheatre Parkway",
                        "addressLine2": "Suite 100",
                        "postalCode": "94043",
                        "adminArea2": "Mountain View",
                        "countryCode": "US",
                        "adminArea1": "CA"
                    }
                }
            }
        ],
        "payment_source": {
            "paypal": {
                "experience_context": {
                    "paymentMethodPreference": "IMMEDIATE_PAYMENT_REQUIRED",
                    "brandName": "EXAMPLE INC",
                    "locale": "en-US",
                    "landingPage": "LOGIN",
                    "shippingPreference": PaypalWalletContextShippingPreference.SetProvidedAddress,
                    "userAction": PaypalExperienceUserAction.PayNow,
                    "returnUrl": returnUrl,
                    "cancelUrl": cancelUrl,
                    "appSwitchContext":  {
                        "launch_paypal_app": true
                    }
                },
                "name": {
                    "givenName": "John",
                    "surname": "Doe"
                },

                "address": {
                    "addressLine1": "1600 Amphitheatre Parkway",
                    "addressLine2": "Suite 100",
                    "postalCode": "94043",
                    "adminArea2": "Mountain View",
                    "countryCode": "US",
                    "adminArea1": "CA"
                },

                "emailAddress": "test@test.com",
                "phone": {
                    "phoneType": PhoneType.Home,
                    "phoneNumber": {
                        "national_number": "4085551234"
                    }
                }
            }
        }
    }
    return createOrder({ orderRequestBody });
}






