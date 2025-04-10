const https = require('https');
const { URL } = require('url');

function axios(config) {
  return new Promise((resolve, reject) => {
    try {
      const urlObj = new URL(config.url);
      const options = {
        method: config.method || 'GET',
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        headers: config.headers || {},
      };

      const req = https.request(options, res => {
        let data = '';

        res.on('data', chunk => {
          data += chunk;
        });

        res.on('end', () => {
          const response = {
            data,
            status: res.statusCode,
            statusText: res.statusMessage,
            headers: res.headers,
            config,
            request: req,
          };

          if (config.validateStatus && !config.validateStatus(res.statusCode)) {
            reject({ ...response, message: 'Request failed with status ' + res.statusCode });
          } else {
            resolve(response);
          }
        });
      });

      req.on('error', err => {
        reject(err);
      });

      if (config.data) {
        req.write(typeof config.data === 'string' ? config.data : JSON.stringify(config.data));
      }

      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = axios;
