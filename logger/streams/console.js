/* eslint-disable class-methods-use-this,no-console */
const xtend = require('xtend');
const ansicolors = require('ansicolors');
const ansistyles = require('ansistyles');


class ColoredConsoleStream {
  constructor(als, output = null) {
    this._als = als;
    this._output = output;
    this._styles = xtend(ansistyles, ansicolors);
    this._levels = {
      60: {type: 'FATAL', color: 'red'},
      50: {type: 'ERROR', color: 'red'},
      40: {type: ' WARN', color: 'magenta'},
      30: {type: ' INFO', color: 'green'},
      20: {type: 'DEBUG', color: 'brightBlack'},
      10: {type: 'TRACE', color: 'brightBlack'},
    };
  }

  _stylize(str, color) {
    if (!str) {
      return '';
    }
    const fn = this._styles[color];
    return fn ? fn(str) : str;
  }

  _indent(str) {
    return str && `\n  ${str.split(/\r?\n/).join('\n  ')}`;
  }

  write(rec) {
    const data = {...rec, ...this._als.get('log-meta')};
    const extras = [];

    const msg = this._stylize(data.msg, 'cyan');
    delete data.msg;

    const err = this._stylize(this._indent(data.err && data.err.stack || ''), this._levels[data.level].color);
    delete data.err;
    delete data.name;

    const time = this._stylize(data.time.toISOString().substr(11), 'brightBlack');
    delete data.time;

    const level = this._stylize(this._levels[data.level].type, this._levels[data.level].color);
    delete data.level;

    const reqId = data.requestId && `[${this._stylize(data.requestId, 'yellow')}]: ` || '';
    delete data.requestId;

    const desc = this._stylize(data.description && `: ${data.description}` || '', 'cyan');
    delete data.description;

    const req = this._stylize(data.req && `\nREQUEST: ${JSON.stringify(data.req, null, 2)}` || '', 'brightBlack');
    delete data.req;

    Object.keys(data).forEach((key) => { extras.push(`${key}=${JSON.stringify(data[key])}`); });
    const details = this._stylize(extras.length && ` (${extras.join(', ')})` || '', 'brightBlack');

    const entry = `${time} ${level}: ${reqId}${msg}${desc}${details}${req}${err}`;
    if (this._output && Array.isArray(this._output)) {
      this._output.push(entry);
      return;
    }
    console.log(entry);
  }
}


module.exports = ColoredConsoleStream;
