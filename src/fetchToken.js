const fetch = require('node-fetch')

const logger = require('./logger.js')

let tokenResponse = false

const fetchToken = async config => {
  try {
    const { clientId, clientSecret, authURL } = config

    const body = `grant_type=client_credentials&client_id=${clientId}&client_Secret=${clientSecret}`

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body,
      json: true
    }

    const response = await fetch(authURL, options)

    if (response.ok) {
      const json = await response.json()
      if (json.access_token) {
        logger('info', 'Access Token retrieved')
        tokenResponse = json
      } else {
        logger('warn', 'Response ok. No Access Token in body')
      }
    } else {
      logger(
        'error',
        `statusCode: ${response.status}\nstatusMessage:${response.statusText}`
      )
    }
  } catch (error) {
    logger('error', `fetchToken: ${error}`)
  } finally {
    return tokenResponse
  }
}

module.exports = fetchToken
