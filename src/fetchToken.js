const fetch = require('node-fetch')

const logger = require('./logger.js')

let tokenResponse = false

const fetchToken = async config => {
  try {
    const { clientId, clientSecret, authURL, resource } = config

    const body = `grant_type=client_credentials&client_id=${clientId}&client_Secret=${clientSecret}&resource=${resource}`
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body,
      json: true
    }

    const response = await fetch(authURL, options)
    const json = await response.json()
    if (response.ok) {
      if (json.access_token) {
        logger('info', 'Access Token retrieved')
        tokenResponse = json
      } else {
        logger('warn', 'Response ok. No Access Token in body')
      }
    } else {
      logger(
        'error',
        `statusCode: ${response.status}\nstatusMessage:${
          response.statusText
        }\nbody:${JSON.stringify(json, '', 2)}`
      )
      tokenResponse = false
    }
  } catch (error) {
    logger('error', `fetchToken: ${error}`)
    tokenResponse = false
  } finally {
    return tokenResponse
  }
}

module.exports = fetchToken
