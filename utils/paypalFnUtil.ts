import {
    ApiError,
    CheckoutPaymentIntent,
    Client,
    CustomError,
    Environment,
    FulfillmentType,
    LogLevel,
    OAuthAuthorizationController,
    OrdersController,
    PaypalExperienceUserAction,
    PaypalPaymentTokenUsageType,
    PaypalWalletContextShippingPreference,
    PhoneType,
    VaultController,
    VaultInstructionAction,
    VaultTokenRequestType,
} from "@paypal/paypal-server-sdk";

import type {
    OAuthProviderError,
    OrderRequest,
    SetupTokenRequest,
} from "@paypal/paypal-server-sdk";
import { getDefaultCredentials } from "./credentialUtil";

/* ######################################################################
 * Set up PayPal controllers
 * ###################################################################### */

const { DOMAINS, PAYPAL_SANDBOX_CLIENT_ID, PAYPAL_SANDBOX_CLIENT_SECRET } =
    getDefaultCredentials()

if (!PAYPAL_SANDBOX_CLIENT_ID || !PAYPAL_SANDBOX_CLIENT_SECRET) {
    throw new Error("Missing API credentials");
}

const client = new Client({
    clientCredentialsAuthCredentials: {
        oAuthClientId: PAYPAL_SANDBOX_CLIENT_ID,
        oAuthClientSecret: PAYPAL_SANDBOX_CLIENT_SECRET,
    },
    timeout: 0,
    environment: Environment.Sandbox,
    logging: {
        logLevel: LogLevel.Info,
        logRequest: {
            logBody: true,
        },
        logResponse: {
            logHeaders: true,
        },
    },
});



const ordersController = new OrdersController(client);
const oAuthAuthorizationController = new OAuthAuthorizationController(client);
const vaultController = new VaultController(client);

/* ######################################################################
 * Token generation helpers
 * ###################################################################### */

export async function getBrowserSafeClientToken() {
    try {
        const auth = Buffer.from(
            `${PAYPAL_SANDBOX_CLIENT_ID}:${PAYPAL_SANDBOX_CLIENT_SECRET}`,
        ).toString("base64");

        const fieldParameters = {
            response_type: "client_token",
            // the Fastlane component requires this domains[] parameter
            ...(DOMAINS ? { "domains[]": DOMAINS } : {}),
        };

        const { result, statusCode } =
            await oAuthAuthorizationController.requestToken(
                {
                    authorization: `Basic ${auth}`,
                },
                fieldParameters,
            );

        // the OAuthToken interface is too general
        // this interface is specific to the "client_token" response type
        interface ClientToken {
            accessToken: string;
            expiresIn: number;
            scope: string;
            tokenType: string;
        }

        const { accessToken, expiresIn, scope, tokenType } = result;
        const transformedResult: ClientToken = {
            accessToken,
            // convert BigInt value to a Number
            expiresIn: Number(expiresIn),
            scope: String(scope),
            tokenType,
        };

        return {
            jsonResponse: transformedResult,
            httpStatusCode: statusCode,
        };
    } catch (error) {
        if (error instanceof ApiError) {
            const { result, statusCode } = error;
            type OAuthError = {
                error: OAuthProviderError;
                error_description?: string;
            };
            return {
                jsonResponse: result as OAuthError,
                httpStatusCode: statusCode,
            };
        } else {
            throw error;
        }
    }
}


/* ######################################################################
 * Token generation helpers
 * ###################################################################### */

export async function getLiveBrowserSafeClientToken(clientId: string, clientSecret: string) {
    const liveClient = new Client({
        clientCredentialsAuthCredentials: {
            oAuthClientId: clientId,
            oAuthClientSecret: clientSecret,
        },
        timeout: 0,
        environment: Environment.Production,
        logging: {
            logLevel: LogLevel.Info,
            logRequest: {
                logBody: true,
            },
            logResponse: {
                logHeaders: true,
            },
        },
    });


    const liveOAuthAuthorizationController = new OAuthAuthorizationController(liveClient);

    try {
        const auth = Buffer.from(
            `${clientId}:${clientSecret}`,
        ).toString("base64");

        const fieldParameters = {
            response_type: "client_token",
            // the Fastlane component requires this domains[] parameter
            ...(DOMAINS ? { "domains[]": DOMAINS } : {}),
        };

        const { result, statusCode } =
            await liveOAuthAuthorizationController.requestToken(
                {
                    authorization: `Basic ${auth}`,
                },
                fieldParameters,
            );

        // the OAuthToken interface is too general
        // this interface is specific to the "client_token" response type
        interface ClientToken {
            accessToken: string;
            expiresIn: number;
            scope: string;
            tokenType: string;
        }

        const { accessToken, expiresIn, scope, tokenType } = result;
        const transformedResult: ClientToken = {
            accessToken,
            // convert BigInt value to a Number
            expiresIn: Number(expiresIn),
            scope: String(scope),
            tokenType,
        };

        return {
            jsonResponse: transformedResult,
            httpStatusCode: statusCode,
        };
    } catch (error) {
        if (error instanceof ApiError) {
            const { result, statusCode } = error;
            type OAuthError = {
                error: OAuthProviderError;
                error_description?: string;
            };
            return {
                jsonResponse: result as OAuthError,
                httpStatusCode: statusCode,
            };
        } else {
            throw error;
        }
    }
}


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



export async function createOrderBCDCInline(returlUrl?: string) {


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
                    "returnUrl": returlUrl ? returlUrl : "http://localhost:3000/return-url",
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












/* ######################################################################
 * Capture orders 
 * ###################################################################### */

export async function captureOrder(orderId: string) {
    try {
        const { result, statusCode } = await ordersController.captureOrder({
            id: orderId,
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
 * Save payment methods
 * ###################################################################### */

export async function createSetupToken(
    setupTokenRequestBody: SetupTokenRequest,
    paypalRequestId?: string,
) {
    try {
        const { result, statusCode } = await vaultController.createSetupToken({
            body: setupTokenRequestBody,
            paypalRequestId,
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

export async function createSetupTokenWithSampleDataForPayPal() {
    const defaultSetupTokenRequestBody = {
        paymentSource: {
            paypal: {
                experienceContext: {
                    cancelUrl: "https://example.com/cancelUrl",
                    returnUrl: "https://example.com/returnUrl",
                    vaultInstruction: VaultInstructionAction.OnPayerApproval,
                },
                usageType: PaypalPaymentTokenUsageType.Merchant,
            },
        },
    };

    return createSetupToken(defaultSetupTokenRequestBody, Date.now().toString());
}

export async function createPaymentToken(
    vaultSetupToken: string,
    paypalRequestId?: string,
) {
    try {
        const { result, statusCode } = await vaultController.createPaymentToken({
            paypalRequestId: paypalRequestId ?? Date.now().toString(),
            body: {
                paymentSource: {
                    token: {
                        id: vaultSetupToken,
                        type: VaultTokenRequestType.SetupToken,
                    },
                },
            },
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
