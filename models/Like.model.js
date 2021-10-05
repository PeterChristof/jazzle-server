const mongoose = require('mongoose');
const {
  Schema,
  model
} = mongoose;

const likesSchema = new Schema({
  user: //String,
  {
    type: Schema.Types.ObjectId,
    ref: 'User' // relates to the Author model
  },
  post: //String,
  {
    type: Schema.Types.ObjectId,
    ref: 'Post' // relates to the Author model
  }
}, {
  timestamps: true
});

module.exports = model('Like', likesSchema);