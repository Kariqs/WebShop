const bcrypt = require("bcryptjs");
const db = require("../data/database");
const { ObjectId } = require("mongodb");
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
  static findUserById(userId) {
    const Id = new ObjectId(userId);
    return db
      .getDatabase()
      .collection("users")
      .findOne({ _id: Id }, { projection: { password: 0 } });
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
