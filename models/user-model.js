const bcrypt = require("bcrypt");
const db = require("../data/database");
class User {
  constructor(email, password, fullname, city, phone) {
    this.email = email;
    this.password = password;
    this.fullname = fullname;
    this.city = city;
    this.phone = phone;
  }
  async signup() {
    await db
      .getDatabase()
      .collection("users")
      .insertOne({
        email: this.email,
        password: await bcrypt.hash(this.password, 12),
        fullname: this.fullname,
        city: this.city,
        phone: this.phone,
      });
  }

  async getUserWithSameEmail() {
    return await db
      .getDatabase()
      .collection("users")
      .findOne({ email: this.email });
  }

  async alreadyExists() {
    const userExists = await this.getUserWithSameEmail();
    if (userExists) {
      return true;
    }
    return false;
  }

  async hasMatchingPassword(hashedPassword) {
    return await bcrypt.compare(this.password, hashedPassword);
  }
}

module.exports = User;
