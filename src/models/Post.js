const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Like a post
postSchema.methods.like = function () {
  this.likes += 1;
  return this.save();
};

// Text search
postSchema.index({
  title: "text",
  content: "text",
});

// Relationship with comments
postSchema.virtual("commentList", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
});

// Enable virtuals when converting to JSON
postSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Post", postSchema);