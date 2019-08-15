const chalk = require('chalk')

const logger = (level, message) => {
  const nowDateTime = new Date()
  const nowString = nowDateTime.toISOString().substr(11, 12)

  switch (level) {
    case 'info':
      console.log(
        `${chalk.green('msiLocal')} ${chalk.gray(
          `[${nowString}]`
        )} ${chalk.green('\u2713')} ${chalk.cyan(message)}`
      )
      break
    case 'action':
      console.log(
        `${chalk.green('msiLocal')} ${chalk.gray(
          `[${nowString}]`
        )} ${chalk.green('\u2713')} ${chalk.cyan(message)}`
      )
      break
    case 'warn':
      console.log(
        `${chalk.yellow('msiLocal')} ${chalk.gray(
          `[${nowString}]`
        )} ${chalk.yellow(message)}`
      )
      break
    case 'error':
      console.log(
        `${chalk.red('msiLocal')} ${chalk.gray(`[${nowString}]`)} ${chalk.red(
          '\u274C'
        )} ${chalk.cyan(message)}`
      )
      break
    default:
      console.log(
        `${chalk.green('msiLocal')} ${chalk.gray(
          `[${nowString}]`
        )} ${chalk.blue(message)}`
      )
  }
}

module.exports = logger
