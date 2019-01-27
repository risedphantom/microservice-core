const domain = require('express-domain-middleware');
const express = require('express');
const compress = require('compression');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');

require('express-async-errors');

const log = require('../logger');
const metrics = require('./core/reporting/metrics');
const Middleware = require('./middlewares');
const Controllers = require('./controllers');


/*
 * Globals
 */
const app = express();

/*
 * Build pipeline
 */
app.enable('trust proxy');
app.use(cookieParser());
app.use(domain);
app.use(compress({}));
app.use(fileUpload());
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(log.middleware);
app.use(Middleware.closing);
app.use(Middleware.metrics);
app.use(Middleware.locale);
app.use('/static', Middleware.statics);
app.use('/admin', Controllers.Admin);
app.use('/sample', Controllers.Sample);
app.use('/metrics', metrics.metricsFunc());
app.use(Middleware.success);
app.use(Middleware.notFound);
app.use(Middleware.error);


module.exports = app;
