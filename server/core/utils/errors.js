// Common types
class ExtendableError extends Error {
  constructor(message) {
    // noinspection JSCheckFunctionSignatures
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 3xx
class MovedPermanentlyError extends ExtendableError {}

// 4xx
class ConflictError extends ExtendableError {}
class NotFoundError extends ExtendableError {}
class ForbiddenError extends ExtendableError {}
class BadRequestError extends ExtendableError {}
class UnauthorizedError extends ExtendableError {}
class NotAcceptableError extends ExtendableError {}
class RequestTimeoutError extends ExtendableError {}
class MethodNotAllowedError extends ExtendableError {}
class UnprocessableEntityError extends ExtendableError {}

// 5xx
class BadGatewayError extends ExtendableError {}
class InternalServerError extends ExtendableError {}
class NotImplementedError extends ExtendableError {}
class GatewayTimeoutError extends ExtendableError {}
class ServiceUnavailableError extends ExtendableError {}

// Custom errors (500)
class VirtualMethodError extends ExtendableError {}

// Custom errors (422)
class SampleModelError extends ExtendableError {}

module.exports = {
  MovedPermanentlyError,
  ConflictError,
  NotFoundError,
  ForbiddenError,
  BadRequestError,
  UnauthorizedError,
  NotAcceptableError,
  RequestTimeoutError,
  MethodNotAllowedError,
  UnprocessableEntityError,
  BadGatewayError,
  NotImplementedError,
  GatewayTimeoutError,
  ServiceUnavailableError,
  InternalServerError,

  VirtualMethodError,
  SampleModelError,
};
