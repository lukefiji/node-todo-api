// Setting process variables based on environment
var env = process.env.NODE_ENV || "development";

if (env === "development" || env === "test") {
  const config = require("./config.json");
  const envConfig = config[env];

  // Iterate over keys
  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key];
  });
}
