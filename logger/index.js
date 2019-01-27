const als = require('async-local-storage');
const uuid = require('uuid').v4;
const Bunyan = require('bunyan');
const schedule = require('node-schedule');

const {useAls, cron, ...loggerOptions} = require('./logger_configuration');
const InMemoryStream = require('./streams/console');


/*
 * Globals
 */
const logger = new Bunyan(loggerOptions).child({className: 'server'}, false);
const levels = {
  10: 'trace',
  20: 'debug',
  30: 'info',
  40: 'warn',
  50: 'error',
  60: 'fatal',
};
const defaultLevel = levels[logger.level()];
const inMemLog = {};
if (useAls) {
  als.enable();
}

class Logger {
  constructor(staticLogger, meta) {
    this._als = als;
    this._meta = meta || [];
    this._logger = staticLogger;
  }

  log(level, ...args) {
    if (args && typeof args[0] === 'object') {
      this._logger[level]({...this._meta, ...args[0]}, ...args.slice(1));
      return;
    }
    this._logger[level](...this._meta, ...args);
  }

  // noinspection JSUnusedGlobalSymbols
  trace(...args) {
    this.log('trace', ...args);
  }

  debug(...args) {
    this.log('debug', ...args);
  }

  info(...args) {
    this.log('info', ...args);
  }

  // noinspection JSUnusedGlobalSymbols
  warn(...args) {
    this.log('warn', ...args);
  }

  error(...args) {
    this.log('error', ...args);
  }

  // noinspection JSUnusedGlobalSymbols
  fatal(...args) {
    this.log('fatal', ...args);
  }

  getLogMeta() {
    return this._als.get('log-meta');
  }

  setLogMeta(meta) {
    return this._als.set('log-meta', meta, false);
  }

  // noinspection JSUnusedGlobalSymbols
  addLogMeta(meta) {
    return this._als.set('log-meta', {...this._als.get('log-meta'), ...meta}, false);
  }

  get streams() {
    return this._logger.streams;
  }

  set streams(streams) {
    this._logger.streams = streams;
  }

  pipeToObject(ctx, id) {
    ctx.log = inMemLog;
    inMemLog[id] = [];
    this._logger.streams = [{
      type: 'raw',
      raw: true,
      closeOnExit: false,
      level: 20,
      stream: new InMemoryStream(als, inMemLog[id]),
    }];
  }
}

const baseLogger = new Logger(logger);

/**
 * Create child logger
 * @param {Object} meta - Child logger meta data
 * @return {Logger}
 */
const child = meta => new Logger(logger, meta);

/**
 * Logging middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {Object}
 */
const middleware = (req, res, next) => {
  const requestId = req.headers['x-request-id'] || uuid();
  req.requestId = requestId;
  baseLogger.setLogMeta({requestId});
  logger.info({req}, `${loggerOptions.project}_INCOMING_REQUEST`);
  next();
};

/**
 * Set global logging level
 * @param {String} level - Log level
 * @return {void}
 */
const setGlobalLevel = (level) => {
  if (levels[logger.level()] === level) {
    return;
  }

  logger.level(level);
  logger[level]({methodName: 'setGlobalLevel'}, `Set log level --> ${level}`);
};

/**
 * Set default global logging level
 * @return {void}
 */
const setDefaultGlobalLevel = () => {
  setGlobalLevel(defaultLevel);
};

/**
 * Get global logging level
 * @return {String}
 */
const getGlobalLevel = () => levels[logger.level()].toUpperCase();

/**
 * JSON.stringify with card, cvv, pwd etc. hiding
 * @param {Object} data - Any object
 * @param {Function} [replacer] - Custom replacer
 * @param {Number} [space] - Tab size
 * @return {String}
 */
const securedStringify = (data, replacer, space) => JSON.stringify(data, replacer, space)
  .replace(/("cardHolder":")[a-zA-Z]+ [a-zA-Z]+(")/, '$1**** ******$2')
  .replace(/("cardholder":")[a-zA-Z]+ [a-zA-Z]+(")/, '$1**** ******$2')
  .replace(/("cardNumber":"\d{6})\d{2,9}(\d{4}")/, '$1******$2')
  .replace(/("secureCode":")\d{3}(")/, '$1***$2')
  .replace(/("password":")[^"]+(")/, '$1***$2')
  .replace(/("number":"\d{6})\d{2,9}(\d{4}")/, '$1******$2')
  .replace(/("pass":")[^"]+(")/, '$1***$2')
  .replace(/("pwd":")[^"]+(")/, '$1***$2')
  .replace(/("pan":"\d{6})\d{2,9}(\d{4}")/, '$1******$2')
  .replace(/("cvv":")\d{3}(")/, '$1***$2')
  .replace(/("csc":")\d{3}(")/, '$1***$2');


module.exports = {
  log: baseLogger,
  child,
  watchdog: schedule.scheduleJob(cron, setDefaultGlobalLevel),
  middleware,
  setGlobalLevel,
  getGlobalLevel,
  securedStringify,
};
