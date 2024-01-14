function getSessionData(req) {
  const sessionData = req.session.userInput;

  req.session.userInput = null;
  return sessionData;
}
function flashDataToSession(req, data, action) {
  req.session.userInput = data;
  req.session.save(action);
}

module.exports = {
  getSessionData: getSessionData,
  flashDataToSession: flashDataToSession,
};
