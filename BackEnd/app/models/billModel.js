const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const schema = mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
      ref: 'User',
    },
    value: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['ToPay', 'ToReceive'],
    },
    dueDate: {
      type: Date,
      required: true,
    },
    emitDate: {
      type: Date,
      required: true,
    },
    installment: String,
    notes: String,
    whereAccount: {
      type: Number,
      required: true,
    },
    paymentDate: Date,
    operation: {
      type: ObjectId,
      ref: 'Operation',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Bill', schema);
