# paypal-backend-api-vercel
An api point for all my backend required projects

## Credentials loading order

The API reads PayPal credentials in this order:

1. `config/paypal.config.local.json`
2. `config/paypal.config.json`
3. Environment variables (`PAYPAL_CLIENT_ID`, `PAYPAL_SECRET`, etc.)

You can also set a custom config path with `PAYPAL_CONFIG_PATH`.

For Vercel production deployment with `vercel deploy --prod`, keep `config/paypal.config.json` in your deployment source (do not ignore it), otherwise the serverless functions cannot read it at runtime.

### Config file format

Use [config/paypal.config.example.json](config/paypal.config.example.json) as the template:

```json
{
	"paypalClientId": "your-paypal-client-id",
	"paypalSecret": "your-paypal-secret",
	"fastlaneDomain": "example.com"
}
```

`config/paypal.config.local.json` is ignored by git for local secrets.

How to init/create this project

1. Make sure `vercel` Command is installed in your PC globally
2. `pnpm init`,`pnpm add -D @vercel/node dotenv` `pnpm add typescript @types/node`
3. `pnpm tsc --init` (for TS support)
4. create `.env`
5. change `package.json` command

---
目前没有CI/CD 需要手动run `pnpm dv`