const { ObjectId } = require("mongodb");
const db = require("../data/database");
class Product {
  constructor(productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.price = productData.price;
    this.description = productData.description;
    this.image = productData.image; //the name of the imagefile.
    this.updateImageData();
    if (productData._id) {
      this.id = productData._id.toString();
    }
  }

  static async findById(productId) {
    let prodId;
    try {
      prodId = new ObjectId(productId);
    } catch (error) {
      error.code = 404;
      throw error;
    }
    const product = await db
      .getDatabase()
      .collection("products")
      .findOne({ _id: prodId });

    if (!product) {
      const error = new Error("Could not find product with that id.");
      error.code = 404;
      throw error;
    }

    return new Product(product);
  }

  static async findAll() {
    const products = await db
      .getDatabase()
      .collection("products")
      .find()
      .toArray();
    return products.map(function (productDocument) {
      return new Product(productDocument);
    });
  }

  updateImageData() {
    this.imagePath = `product-data/images/${this.image}`;
    this.imageUrl = `/products/assets/images/${this.image}`;
  }

  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      price: +this.price,
      description: this.description,
      image: this.image,
    };

    if (this.id) {
      const productId = new ObjectId(this.id);
      if (!this.image) {
        delete productData.image;
      }
      await db
        .getDatabase()
        .collection("products")
        .updateOne({ _id: productId }, { $set: productData });
    } else {
      await db.getDatabase().collection("products").insertOne(productData);
    }
  }

  replaceImage(newImage) {
    this.image = newImage;
    this.updateImageData();
  }
 remove() {
    const productId = new ObjectId(this.id);
    return db.getDatabase().collection("products").deleteOne({ _id: productId });
  }
}

module.exports = Product;