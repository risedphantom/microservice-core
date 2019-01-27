/* Clear require cache */
const decache = require('clear-module');

decache.all();

const sandbox = require('sinon').createSandbox();
const request = require('supertest');

const utils = require('../../../../server/core/utils');
const logger = require('../../../../logger');
const storage = require('../../../../server/singleton').storage;
const singleton = require('../../../../server/singleton');
const responses = require('./admin_data_test');

singleton.cache = require('../../../../server/core/utils/inprocess_cache');

/* Express app is always loaded last */
const app = require('../../../../server/server');

const streams = logger.log.streams;


describe('💡 Test admin controller', function root() {
  before(() => {
    // Mock storage
    storage.credentials.getPermissions = () => responses.getPermissions;
  });
  beforeEach(() => {
    logger.log.pipeToObject(this.ctx.currentTest.ctx, this.ctx.currentTest.fullTitle());
    // Stub time measurement
    sandbox.stub(utils, 'hrtimeToMs').returns(0);
  });
  afterEach(() => {
    logger.log.streams = streams;
    singleton.cache.flushAll();
    sandbox.restore();
  });

  describe('Check getLogLevel method', () => {
    it('Success', (done) => {
      request(app)
        .get('/admin/log-level')
        .auth('12trip', '123456')
        .expect(200, responses.get_log_level, done);
    });

    it('Error - no auth', (done) => {
      request(app)
        .get('/admin/log-level')
        .expect(401, responses.error_no_auth, done);
    });
  });

  describe('Check setLogLevel method', () => {
    it('Success', (done) => {
      request(app)
        .post('/admin/log-level')
        .type('text/plain')
        .send('DEBUG')
        .auth('12trip', '123456')
        .expect(200, responses.success_ok, done);
    });

    it('Error - no auth', (done) => {
      request(app)
        .post('/admin/log-level')
        .expect(401, responses.error_no_auth, done);
    });
  });
});
