const failAction = (request, headers, erro) => {
  throw erro;
};

module.exports = failAction;
