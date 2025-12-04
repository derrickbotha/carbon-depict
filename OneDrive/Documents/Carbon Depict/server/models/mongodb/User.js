const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 12,
      validate: {
        validator: function(v) {
          // At least 12 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
          const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/
          return strongPasswordRegex.test(v)
        },
        message: 'Password must be at least 12 characters and include uppercase, lowercase, number, and special character (@$!%*?&)'
      }
    },
    firstName: {
      type: String,
      trim: true,
      default: '',
    },
    lastName: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'user'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

UserSchema.virtual('company', {
  ref: 'Company',
  localField: 'companyId',
  foreignField: '_id',
  justOne: true,
})

// Common weak passwords list
const COMMON_PASSWORDS = [
  'password', 'password123', '123456789', '12345678', 'qwerty123',
  'abc123456', 'password1', 'letmein123', 'welcome123', 'admin123',
  'password!', 'Password1!', 'Welcome123!', 'Qwerty123!', 'Admin123!'
]

UserSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next()
  }

  try {
    // Check against common passwords before hashing
    const passwordLower = this.password.toLowerCase()
    if (COMMON_PASSWORDS.some(common => passwordLower.includes(common.toLowerCase()))) {
      const error = new Error('Password is too common. Please choose a stronger, more unique password.')
      error.name = 'ValidationError'
      return next(error)
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

UserSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

UserSchema.methods.toSafeObject = function toSafeObject() {
  const obj = this.toObject()
  delete obj.password
  return obj
}

module.exports = mongoose.model('User', UserSchema)
