const useSsl = process.env.DATABASE_SSL === "true";

const config = {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
    ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
  },
};

export default config;
