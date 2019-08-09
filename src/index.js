const fetchConfig = require('./fetchConfig.js')
const localServer = require('./localServer.js')
const logger = require('./logger.js')

const startServer = async () => {
  try {
    const config = await fetchConfig()
    const endpoint = process.env['MSI_ENDPOINT']
      ? process.env['MSI_ENDPOINT']
      : false
    const secret = process.env['MSI_SECRET'] ? process.env['MSI_SECRET'] : false

    if (endpoint && secret) {
      const portString = endpoint.substring(endpoint.lastIndexOf(':') + 1)
      const port = parseInt(portString)
      if (typeof port === 'number') {
        logger('info', 'Starting server')
        if (config) {
          localServer(config, port)
        } else {
          logger('error', 'Unable to start server')
        }
      } else {
        logger(
          'error',
          `Invalid port number ${port} specified. Please check the value of MSI_ENDPOINT ${endpoint}`
        )
      }
    } else {
      logger('error', 'MSI_ENDPOINT and/or MSI_SECRET not set.')
    }
  } catch (error) {
    logger('error', `startServer: ${error}`)
  }
}

module.exports = startServer
