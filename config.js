/**
 * Global configuration file for all of the WebApp
 */

// Environment variable for local (true) / lambda (false) app running
const local = true;

const config = {};
config.stage = "/dev";
config.stageInWebURL = (local) ? "" : config.stage;
config.stageInApiURL = config.stage;

module.exports = config;
