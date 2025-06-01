function createErrorResponse(statusCode, title, detail, code) {
  return {
    status: statusCode,
    title: title,
    detail: detail,
    code: code
  };
}

module.exports = {
  createErrorResponse
};
