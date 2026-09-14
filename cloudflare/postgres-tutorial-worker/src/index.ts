import { Client } from "pg";

export default {
	async fetch(request, env, ctx): Promise<Response> {
		// Create a new Client instance using the connection string
		// or explicit parameters as shown in the previous steps.
		// Here, we are using the connection string method.
		const sql = new Client({connectionString: env.DB_URL,});
		// Hyperdrive
		// const sql = new Client({connectionString: env.HYPERDRIVE.connectionString})
		// const url = new URL(request.url);
		// Connect to the PostgreSQL database
		await sql.connect();

		// Query the products table
		const result = await sql.query("SELECT * FROM app_private.insert_demo");

		// Return the result as JSON
		return new Response(JSON.stringify(result.rows), {
			headers: {
				"Content-Type": "application/json",
			},
		});
	},
} satisfies ExportedHandler<Env>;