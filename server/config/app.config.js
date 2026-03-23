/**
 * Module for bootstrapping application configuration and handling secrets from Vault.
 */

let directoryProxyConfig = {};
let directoryAuthProxyConfig = {};
let directoryCreateUserProxyConfig = {};
let directoryVerifyCodeProxyConfig = {};
let directoryUserProfileImageProxyConfig = {};
const fs = require('node:fs');
const {format} = require('logform');
const winston = require('winston');

let loggerInstance;

function getAppLogger() {
    if (!loggerInstance) {
        const argv = require('yargs').argv;
        const debugMode = argv.debugMode === 'true' || process.env.ENABLE_DEBUG === 'true';
        const logLevel = debugMode ? 'debug' : 'info';

        loggerInstance = winston.createLogger({
            level: logLevel,
            format: format.combine(
                format.json(),
                format.timestamp(),
            ),
            transports: [
                new winston.transports.Console()
            ]
        });
    }
    return loggerInstance;
}

/**
 * Bootstraps the application configuration by loading secrets from Vault if provided.
 *
 * @param {Object} app - The application instance.
 * @returns {Promise} - A promise that resolves with the configuration or null.
 */
module.exports.bootstrapConfiguration = function (app) {
    const argv = require('yargs').argv;

    return new Promise(function (resolve, reject) {
        require('dotenv').config({path: "default.env"});

        if (argv.vaultToken && argv.vaultUrl && argv.vaultPath) {
            loadSecretsIntoEnv(argv.vaultUrl, argv.vaultToken, argv.vaultPath, argv.debugMode).then(config => {
                resolve(config);
            }, error => {
                getAppLogger().error("Unable to load secrets from vault");
                reject(error);
            });
        } else {
            getAppLogger().info("No vault configuration found");
            resolve(null);
        }
    });
};

/**
 * Loads secrets from Vault into environment variables.
 *
 * @param {string} vaultUrl - The URL of the Vault server.
 * @param {string} vaultToken - The token for authenticating with Vault.
 * @param {string} vaultPath - The path in Vault where secrets are stored.
 * @param {boolean} isDebugMode - A flag indicating whether debug mode is enabled.
 * @returns {Promise} - A promise that resolves with the configuration or rejects with an error.
 */
let loadSecretsIntoEnv = function (vaultUrl, vaultToken, vaultPath, isDebugMode) {
    return new Promise(function (resolve, reject) {
        let vaultClient = require("node-vault-client");
        console.log('[APP-CFG] - Vault token load:: OK');
        if(isDebugMode) {
            console.log(`[APP-CFG] - Vault token value:: ${vaultToken}`);
        }

        vaultClient = vaultClient.boot('main', {
            api: {url: vaultUrl},
            auth: {
                type: 'token',
                config: {token: vaultToken}
            },
        });

        vaultClient.read(vaultPath).then(v => {
            let vaultValues = v.__data.data;
            for (let key in vaultValues) {
                process.env[key] = vaultValues[key];
            }
            if (vaultValues !== undefined) {
                getAppLogger().info("Loaded secrets from vault");
                const config = require('config');
                resolve(config);
                if (isDebugMode) printVaultValues(vaultValues);
            }
        }).catch(error => {
            getAppLogger().error("Unable to load secrets from vault", error);
            reject("Unable to load secrets from vault", error);
            console.error(error)
        });
    });
};

/**
 * Creates a logger instance using Winston.
 *
 * @returns {Object} - A Winston logger instance.
 */
module.exports.getLoggerApp = function () {
    return getAppLogger();
};

/**
 * Reads and parses the directory proxy configuration from a JSON file.
 */
module.exports.createDirectoryProxyConfig = function () {
    const configJson = fs.readFileSync('server/config/config.json', 'utf8');
    const config = JSON.parse(configJson);
    directoryProxyConfig = config['directoryBackendProxyConfig'];
    directoryAuthProxyConfig = config['directoryBackendAuthProxyConfig'];
    directoryVerifyCodeProxyConfig = config['directoryBackendVerifyCodeProxyConfig'];
    directoryCreateUserProxyConfig = config['directoryBackendCreateUserProxyConfig'];
    directoryUserProfileImageProxyConfig = config['directoryBackendUserProfileImageProxyConfig'];
    getAppLogger().info("[DS] - Proxy Config [Directory]: " + JSON.stringify(directoryProxyConfig));
    getAppLogger().info("[DS] - Proxy Config [Directory Auth]: " + JSON.stringify(directoryAuthProxyConfig));
    getAppLogger().info("[DS] - Proxy Config [Directory Register]: " + JSON.stringify(directoryVerifyCodeProxyConfig));
    getAppLogger().info("[DS] - Proxy Config [Directory Create User]: " + JSON.stringify(directoryCreateUserProxyConfig));
    getAppLogger().info("[DS] - Proxy Config [Directory User Image Profile]: " + JSON.stringify(directoryUserProfileImageProxyConfig));
};

/**
 * Retrieves the directory proxy configuration.
 *
 * @returns {Object} - The directory proxy configuration.
 */
module.exports.getDirectoryProxyConfig = function () {
    return directoryProxyConfig;
};

/**
 * Retrieves the directory proxy configuration.
 *
 * @returns {Object} - The directory proxy configuration.
 */
module.exports.getDirectoryAuthProxyConfig = function () {
  return directoryAuthProxyConfig;
};

/**
 * Retrieves the directory proxy configuration.
 *
 * @returns {Object} - The directory proxy configuration.
 */
module.exports.getDirectoryCreateUserProxyConfig = function () {
  return directoryCreateUserProxyConfig;
};

module.exports.getDirectoryVerifyCodeProxyConfig = function () {
  return directoryVerifyCodeProxyConfig;
};

module.exports.getDirectoryUserProfileImageProxyConfig = function () {
  return directoryUserProfileImageProxyConfig;
};

let printVaultValues = function (vaultValues) {
    // Defensive: if vaultValues is not an object, log it directly
    if (!vaultValues || typeof vaultValues !== 'object') {
        getAppLogger().info('Vault values (raw):', vaultValues);
        console.log('Vault values (raw):', vaultValues);
        return;
    }

    // Build a two-column table (key | value) string for logger output
    const entries = Object.entries(vaultValues);
    const keyWidth = Math.max(...entries.map(([k]) => String(k).length), 4);
    const headerKey = 'KEY'.padEnd(keyWidth);
    const headerVal = 'VALUE';
    const separator = '-'.repeat(keyWidth) + ' | ' + '-'.repeat(40);

    let tableLines = [];
    tableLines.push('\n<><><><><><><><> Vault values (table) <><><><><><><><>');
    tableLines.push(`${headerKey} | ${headerVal}`);
    tableLines.push(separator);
    for (const [k, v] of entries) {
        // Convert value to string safely and truncate long values for log readability
        let valueStr;
        try { valueStr = typeof v === 'string' ? v : JSON.stringify(v); } catch (e) { valueStr = String(v); }
        if (valueStr.length > 200) valueStr = valueStr.substring(0, 197) + '...';
        tableLines.push(`${String(k).padEnd(keyWidth)} | ${valueStr}`);
    }
    tableLines.push('<><><><><><><><><><><><><><><><><><><><><><><><><><><>\n');

    // Log as a single multi-line message so structured loggers keep it together
    getAppLogger().info(tableLines.join('\n'));

    // Also print a native console.table in dev shells for easier reading
    try { console.table(vaultValues); } catch (e) { /* ignore console.table errors on non-interactive sinks */ }
}

