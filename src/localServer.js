const http = require('http')
const fetchToken = require('./fetchToken.js')
const logger = require('./logger.js')
let msiResponse

const localServer = async (config, port) => {
  try {
    const server = http.createServer(function (req, res) {
      if (req.method === 'GET') {
        let reqData
        req.on('data', chunk => {
          reqData += chunk
        })

        req.on('error', error => logger('error', `localServer: ${error}`))

        req.on('end', async () => {
          if (msiResponse) {
            if (msiResponse.expires_on < Date.now()) {
              logger(
                'info',
                'Token expired, fetching new token from Active Directory'
              )
              const newToken = await fetchToken(config)
              if (newToken) {
                const { token_type, expires_on, access_token } = newToken
                msiResponse = {
                  token_type,
                  expires_on,
                  access_token,
                  resource: 'msiLocal'
                }
              }
            }
          } else {
            logger('info', 'Fetching token from Active Directory')
            const newToken = await fetchToken(config)
            if (newToken) {
              const { token_type, expires_on, access_token } = newToken
              msiResponse = {
                token_type,
                expires_on,
                access_token,
                resource: 'msiLocal'
              }
            }
          }

          if (msiResponse) {
            const responseString = JSON.stringify(msiResponse)
            const contentLength = responseString.length
            res.writeHead(200, {
              'Content-Length': contentLength,
              'Content-Type': 'application/json'
            })
            res.write(responseString, 'utf8')
            res.end(() => {
              logger('info', `MSI queried`)
            })
          }
        })
      }
    })
    logger('info', `Starting server on http://localhost:${port}`)
    server.listen(port)
  } catch (error) {
    logger('error', `localServer: ${error}`)
  }
}

module.exports = localServer
