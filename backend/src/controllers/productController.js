import Product from "../models/Product.js";
import Review from "../models/review.js";
import fs from "fs";


// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      image: req.file ? req.file.path : req.body.image,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.log("File delete error:", err);
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// GET ALL PRODUCTS (Search + Filter + Pagination)
export const getProducts = async (req, res) => {
  try {
    let {
      search,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      available,
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    let query = {};

    //  Search
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    //  Category
    if (category) {
      query.category = category;
    }

    //  Price filter
    if (minPrice || maxPrice) {
      query.pricePerMonth = {};
      if (minPrice) query.pricePerMonth.$gte = Number(minPrice);
      if (maxPrice) query.pricePerMonth.$lte = Number(maxPrice);
    }

    //  Availability filter
    if (available !== undefined) {
      query.isAvailable = available === "true";
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const reviews = await Review.find({ product: product._id }).populate(
      "user",
      "name",
    );
    // ✅ Calculate average rating
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    res.json({
      product,
      reviews,
      averageRating: avgRating,
      reviewCount: reviews.length,
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    //  old image delete
    if (req.file && product.image) {
      fs.unlink(product.image, (err) => {
        if (err) console.log("Old image delete error:", err);
      });
    }

    // update allowed fields only
    const fields = [
      "name",
      "description",
      "category",
      "pricePerMonth",
      "deposit",
      "tenureOptions",
      "stock",
      "isAvailable",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    if (req.file) {
      product.image = req.file.path;
    }

    product = await product.save();

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // 🔥 delete image file
    if (product.image) {
      fs.unlink(product.image, (err) => {
        if (err) console.log("Delete image error:", err);
      });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
