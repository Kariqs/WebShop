function isEmpty(value) {
  return !value || value.trim() === "";
}

function userCredentialsAreValid(email, password) {
  return email && email.includes("@") && password && password.trim().length > 5;
}
function userDetailsAreValid(email, password, fullname, city, phone) {
  return (
    userCredentialsAreValid(email, password) &&
    !isEmpty(fullname) &&
    !isEmpty(city) &&
    !isEmpty(phone)
  );
}

function emailIsConfirmed(email, confirmEmail) {
  return email === confirmEmail;
}

module.exports = {
  userDetailsAreValid: userDetailsAreValid,
  emailIsConfirmed: emailIsConfirmed,
};
