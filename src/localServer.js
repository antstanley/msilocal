const http = require('http')
const fetchToken = require('./fetchToken.js')
// const querystring = require('querystring')
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
          const fullURL = req.headers.host.concat(req.url)
          const reqURL = new URL(fullURL)
          if (reqURL.searchParams.has('resource')) {
            const resource = reqURL.searchParams.get('resource')
            config['resource'] = resource
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
                    resource
                  }
                } else {
                  msiResponse = false
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
                  resource
                }
              } else {
                msiResponse = false
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
            } else {
              const responseString = JSON.stringify({
                error: 'Unable to process request'
              })
              const contentLength = responseString.length
              res.writeHead(200, {
                'Content-Length': contentLength,
                'Content-Type': 'application/json'
              })
              res.write(responseString, 'utf8')
              res.end(() => {
                logger('warn', `Request Failed`)
              })
            }
          } else {
            logger(
              'warn',
              '"resource" query parameter missing. Please include.'
            )
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
