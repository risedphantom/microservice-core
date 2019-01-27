/* Clear require cache */
const decache = require('clear-module');

decache.all();

const uuid = require('uuid');
const sandbox = require('sinon').createSandbox();
const request = require('supertest');

const logger = require('../../../../logger');
const storage = require('../../../../server/singleton').storage;
const requests = require('../../../../server/singleton').requests;
const testData = require('./sample_req_test');
const singleton = require('../../../../server/singleton');
const responses = require('./sample_data_test');

singleton.cache = require('../../../../server/core/utils/inprocess_cache');

/* Express app is always loaded last */
const app = require('../../../../server/server');

const streams = logger.log.streams;


describe('💡 Test sample controller', function root() {
  before(() => {
    // Mock storage
    storage.credentials.getPermissions = () => responses.getPermissions;
    storage.entity1.getState = () => responses.getState;
    storage.entity2.get = () => responses.get;
    requests.jsonPlaceholder.getTodo = () => responses.getTodo;
  });
  beforeEach(() => {
    logger.log.pipeToObject(this.ctx.currentTest.ctx, this.ctx.currentTest.fullTitle());
    // Stub time measurement
    sandbox.stub(process, 'hrtime').returns(responses.hrtime);
    // Stub uuid gen
    sandbox.stub(uuid, 'v4').returns(responses.uuid);
  });
  afterEach(() => {
    logger.log.streams = streams;
    sandbox.restore();
  });

  describe('Check getByQueryParams method', () => {
    it('Success - with old session', (done) => {
      request(app)
        .get('/sample/get-by-query-params?id=test_id')
        .auth(testData.login, testData.password)
        .expect('x-state', responses.getState)
        .expect('set-cookie', responses.cookie_old_session)
        .expect(200, responses.success, done);
    });

    it('Success - with new session', (done) => {
      sandbox.stub(storage.entity2, 'get').returns(responses.get_empty);

      request(app)
        .get('/sample/get-by-query-params?id=test_id')
        .auth(testData.login, testData.password)
        .expect('x-state', responses.getState)
        .expect('set-cookie', responses.cookie_new_session)
        .expect(200, responses.success, done);
    });

    it('Error - no state', (done) => {
      sandbox.stub(storage.entity1, 'getState').returns(responses.getState_empty);

      request(app)
        .get('/sample/get-by-query-params?id=test_id')
        .auth(testData.login, testData.password)
        .expect('x-error', responses.header_broken_data)
        .expect('set-cookie', responses.cookie_old_session)
        .expect(422, responses.error_broken_data, done);
    });

    it('Error - storage exception', (done) => {
      sandbox.stub(storage.entity1, 'getState').throws(responses.getState_exception);

      request(app)
        .get('/sample/get-by-query-params?id=test_id')
        .auth(testData.login, testData.password)
        .expect('x-error', responses.header_read_error)
        .expect(500, responses.error_internal, done);
    });
  });
});
