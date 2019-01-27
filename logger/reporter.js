const ms = require('mocha/lib/ms');
const Base = require('mocha/lib/reporters/base');
const Spec = require('mocha/lib/reporters/spec');
const inherits = require('mocha/lib/utils').inherits;

const color = Base.color;


function Ott(runner) {
  Spec.call(this, runner);

  const self = this;

  runner.removeAllListeners('end');
  runner.on('end', () => {
    const stats = this.stats;
    stats.end = new Date();
    stats.duration = new Date() - stats.start;

    console.log();

    // passes
    const fmt = `${color('bright pass', ' ')}${color('green', ' %d passing')}${color('light', ' (%s)')}`;
    console.log(fmt, stats.passes || 0, ms(stats.duration));

    // pending
    if (stats.pending) {
      console.log(`${color('pending', ' ')}${color('pending', ' %d pending')}`, stats.pending);
    }

    // failures
    if (stats.failures) {
      console.log(color('fail', '  %d failing'), stats.failures);
      // Append log
      self.failures.forEach((test) => {
        if(!test.ctx.log || !test.ctx.log[test.fullTitle()]) {
          return;
        }

        test.err.message = `\n${color('error message', '[*** START LOG ***]')}\n${test.ctx.log[test.fullTitle()].join('\n')}\n${color('error message', '[*** END LOG ***]')}\n`;
      });

      Base.list(self.failures);
      console.log();
    }
  });
}

inherits(Ott, Spec);


module.exports = Ott;

