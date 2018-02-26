/**
 * Global configuration file for all of the WebApp
 */

// Environment variable for local (true) / lambda (false) app running
const local = true;

const config = {};
config.stage = "/dev";
config.stageInWebURL = (local) ? "" : config.stage;
config.stageInApiURL = config.stage;
config.database = {};
config.database.region = "eu-west-2";
config.database.endpoint = (local) ? "http://localhost:8000" : "https://dynamodb.eu-west-2.amazonaws.com";
config.dataApiURL = "https://zm4v09x6ai.execute-api.eu-west-2.amazonaws.com";

module.exports = config;
