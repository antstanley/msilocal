const fs = require('fs')
const path = require('path')
const logger = require('./logger.js')

const fetchConfig = async () => {
  let config
  try {
    const configFile = path.join(process.cwd(), 'msilocal.json')

    if (fs.existsSync(configFile)) {
      config = JSON.parse(fs.readFileSync(configFile))
      logger('info', `Config initialised`)
    } else {
      logger('warn', `Config file '${configFile}' does not exist`)
    }
  } catch (error) {
    logger('error', `fetchConfig: ${error}`)
    config = false
  } finally {
    return config
  }
}

module.exports = fetchConfig
