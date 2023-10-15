const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'must provide a user name'],
    maxLength: 25,
    minLength: 6,
  },
  email: {
    type: String,
    required: [true, 'must provide an email address'],
    unique: true,
    lowercase: true,
    validate: [
      validator.isEmail,
      'invalid email form try to use the form: somthing@something.something',
    ],
  },
  photo: { type: String, default: 'default.jpg' },
  password: {
    type: String,
    required: [true, 'must provide a password'],
    minLength: [8, 'must be at least 8 characters'],
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  passwordConfirm: {
    type: String,
    required: [true, 'must confirm the password'],
    validate: {
      //THIS ONLY WORKS ON CREATE OR SAVE
      validator: function (val) {
        return val === this.password;
      },
      message: 'passwords aren not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  active: { type: Boolean, default: true, select: false },
});
userSchema.pre('save', async function (next) {
  //ONLY RUN IF PASSWORD HAS CHANGED OR CREATED
  if (!this.isModified('password')) return next();
  //HASH THE PASSWORD WITH THE COST OF 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimeStamp < changedTimeStamp;
  }

  return false;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .Hash('sha256')
    .update(resetToken)
    .digest('hex');
  console.log(this.passwordResetToken, resetToken);
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
const User = mongoose.model('User', userSchema);
module.exports = User;
