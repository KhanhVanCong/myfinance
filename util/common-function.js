const getMessageFlash = function (req, typeMessage) {
  let message = req.flash(typeMessage);
  if (message.length <= 0) {
    message = null;
  }
  return message;
}

module.exports = { getMessageFlash };