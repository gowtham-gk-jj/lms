const Article = require("../models/Article");

// Get all PUBLISHED articles (for users)
exports.getPublishedArticles = async (req, res) => {
  try {
    const articles = await Article.find({ published: true })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all articles (admin only)
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single article
exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate(
      "author",
      "name email"
    );

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Users can only view published articles
    if (req.user.role === "user" && !article.published) {
      return res.status(403).json({ message: "This article is not published" });
    }

    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create article (admin only)
exports.createArticle = async (req, res) => {
  try {
    const { title, category, tags, content, published } = req.body;

    const article = new Article({
      title,
      category,
      tags: tags || [],
      content,
      author: req.user._id,
      published: published || false,
    });

    const savedArticle = await article.save();
    const populatedArticle = await Article.findById(savedArticle._id).populate(
      "author",
      "name email"
    );

    res.status(201).json(populatedArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update article (admin only)
exports.updateArticle = async (req, res) => {
  try {
    const { title, category, tags, content, published } = req.body;

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { title, category, tags, content, published },
      { new: true, runValidators: true }
    ).populate("author", "name email");

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete article (admin only)
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Publish / Unpublish article (admin only)
exports.togglePublish = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    article.published = !article.published;
    await article.save();

    const populatedArticle = await Article.findById(article._id).populate(
      "author",
      "name email"
    );

    res.json(populatedArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
