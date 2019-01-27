class DefaultStream {
  constructor(als) {
    this._als = als;
    this._levels = {
      70: 'Z',
      60: 'C',
      50: 'E',
      40: 'W',
      30: 'I',
      20: 'D',
      10: 'T',
    };
  }

  _map(rec) {
    return {
      '@timestamp': new Date(),
      ...rec,
      levelType: this._levels[rec.level],
      ...this._als.get('log-meta'),
    };
  }

  write(rec) {
    process.stdout.write(`${JSON.stringify(this._map(rec))}\n`);
  }
}


module.exports = DefaultStream;
