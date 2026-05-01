import Review from "../models/Review.js";
import Order from "../models/Order.js";

// ✅ Add review (only if user purchased product)
export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // check if user purchased product
    const order = await Order.findOne({
      user: req.user._id,
      "items.product": productId,
      status: "confirmed",
    });

    if (!order) {
      return res
        .status(400)
        .json({ message: "You must purchase product before reviewing" });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating,
      comment,
    });

    res.status(201).json({ message: "Review added", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get reviews for product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).populate(
      "user",
      "name",
    );
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Calculate average rating
export const getAverageRating = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId });

    if (reviews.length === 0) return res.json({ averageRating: 0 });

    const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    res.json({ averageRating: avg });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
