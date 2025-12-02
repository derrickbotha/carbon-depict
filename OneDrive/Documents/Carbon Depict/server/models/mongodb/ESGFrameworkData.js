const mongoose = require('mongoose');

const ESGFrameworkDataSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  framework: {
    type: String,
    required: true,
    enum: ['gri', 'tcfd', 'sbti', 'csrd', 'cdp', 'sdg', 'sasb', 'issb', 'pcaf'],
    index: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: {}
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedFields: {
    type: Number,
    default: 0
  },
  totalFields: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  version: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['draft', 'in-progress', 'completed', 'published'],
    default: 'draft'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for efficient querying
ESGFrameworkDataSchema.index({ companyId: 1, framework: 1 });

// Update lastUpdated on save
ESGFrameworkDataSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

// Calculate progress based on data completeness
ESGFrameworkDataSchema.methods.calculateProgress = function() {
  let totalFields = 0;
  let completedFields = 0;

  const countFields = (obj) => {
    Object.values(obj).forEach((section) => {
      if (section && typeof section === 'object') {
        if (section.hasOwnProperty('completed')) {
          totalFields++;
          if (section.completed) completedFields++;
        } else {
          countFields(section);
        }
      }
    });
  };

  if (this.data) {
    countFields(this.data);
  }

  this.totalFields = totalFields;
  this.completedFields = completedFields;
  this.progress = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;

  return this.progress;
};

const ESGFrameworkData = mongoose.model('ESGFrameworkData', ESGFrameworkDataSchema);

module.exports = ESGFrameworkData;
