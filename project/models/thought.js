const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;
const moment = require('moment');

// Reaction subdocument schema
const reactionSchema = new Schema({
  reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  reactionBody: {
    type: String,
    required: true,
    maxLength: 280,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: timestamp => moment(timestamp).format('MMM DD, YYYY [at] hh:mm a')
  },
}, {
  _id: false,
  toJSON: {
    getters: true
  }
});

// Thought schema using reactionSchema as a subdocument
const thoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 280,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: timestamp => moment(timestamp).format('MMM DD, YYYY [at] hh:mm a')
  },
  username: {
    type: String,
    required: true,
  },
  reactions: [reactionSchema]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true
  },
  toObject: {
    virtuals: true
  }
});

// Virtual for reaction count
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

module.exports = model('Thought', thoughtSchema);
