## Config
If your compatibility date is before 2026-08-04, add the nodejs_compat compatibility flag to your Wrangler configuration file to opt in:
./wrangler.jsonc
{
	"compatibility_flags": [
		"nodejs_compat"
	]
}

## NPM
npm i pg
npm i -D @types/pg

## Connection String:
postgresql://username:password@host:port/database
Set your connection string as a secret so that it is not stored as plain text. Use wrangler secret put with the example variable name DB_URL:
`npx wrangler secret put DB_URL`
`npx wrangler secret put DATABASE_URL`

## Use Hyperdrive to accelerate queries
npx wrangler hyperdrive create <NAME_OF_HYPERDRIVE_CONFIG> --connection-string="postgres://user:password@HOSTNAME_OR_IP_ADDRESS:PORT/database_name" --caching-disabled