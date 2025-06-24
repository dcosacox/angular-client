const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000; // Use a different port than Angular (4200)

// Path to your proxy config file
const proxyConfigPath = path.join(__dirname, 'proxy.conf.json');

console.log(`Attempting to load proxy config from: ${proxyConfigPath}`);

let proxyConfig;
try {
    const configFileContent = fs.readFileSync(proxyConfigPath, 'utf8');
    proxyConfig = JSON.parse(configFileContent);
    console.log('Successfully loaded and parsed proxy config:');
    console.log(JSON.stringify(proxyConfig, null, 2));
} catch (error) {
    console.error('ERROR: Could not load or parse proxy config file!');
    console.error(error);
    process.exit(1); // Exit if config fails to load
}

// Iterate over proxy rules and apply them
for (const context in proxyConfig) {
    if (proxyConfig.hasOwnProperty(context)) {
        const options = proxyConfig[context];
        // Fix for older http-proxy-middleware versions expecting target property directly
        if (typeof options === 'object' && options.target) {
            console.log(`Setting up proxy for context: ${context} to target: ${options.target}`);
            app.use(context, createProxyMiddleware(options));
        } else {
            console.warn(`Invalid proxy option for context ${context}:`, options);
        }
    }
}

// Serve a simple static file to test (optional)
app.get('/', (req, res) => {
    res.send('Proxy test server is running. Try going to /api/some-endpoint');
});

app.listen(port, () => {
    console.log(`Test proxy server listening on http://localhost:${port}`);
});