const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      type: String,
      amount: Number,
      category: String,
      note: String,
      date: Date,
});

module.exports = mongoose.model("Transaction", transactionSchema);
