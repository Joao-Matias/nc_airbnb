const filterUserSetStr = (id, firstName, surname, email, phone, avatar) => {
  const queryValues = [id];
  let setStr = ' SET';

  if (firstName) {
    queryValues.push(firstName);
    setStr += ` first_name = $${queryValues.length},`;
  }
  if (surname) {
    queryValues.push(surname);
    setStr += ` surname = $${queryValues.length},`;
  }
  if (email) {
    queryValues.push(email);
    setStr += ` email = $${queryValues.length},`;
  }
  if (phone) {
    queryValues.push(phone);
    setStr += ` phone_number = $${queryValues.length},`;
  }
  if (avatar) {
    queryValues.push(avatar);
    setStr += ` avatar = $${queryValues.length},`;
  }

  setStr = setStr.slice(0, -1);

  return { queryValues, setStr };
};

function isMobileNumber(mobileNumber) {
  if (/[a-z]/gi.test(mobileNumber)) return false;

  if (mobileNumber.length === 11 && mobileNumber.slice(0, 2) === '07') {
    return true;
  } else if (mobileNumber.length === 13 && mobileNumber.slice(0, 4) === '+447') {
    return true;
  } else if (mobileNumber.length === 14 && mobileNumber.slice(0, 5) === '00447') {
    return true;
  } else {
    return false;
  }
}

module.exports = { filterUserSetStr, isMobileNumber };
