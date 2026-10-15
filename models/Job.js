import mongoose from 'mongoose'

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide company'],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, 'Please provide position'],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
      default: 'pending',
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'internship'],
      default: 'full-time',
    },
    jobLocation: {
      type: String,
      default: 'my city',
      required: true,
    },
    jobDescription: {
      type: String,
      default: '',
      maxlength: 10000,
    },
    resumeAnalysis: {
      type: new mongoose.Schema(
        {
          score: { type: Number, min: 0, max: 100 },
          matchedKeywords: [{ type: String }],
          missingKeywords: [{ type: String }],
          provider: { type: String, enum: ['gemini', 'local-fallback'] },
          model: { type: String },
          analyzedAt: { type: Date },
        },
        { _id: false }
      ),
      default: undefined,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
)

export default mongoose.model('Job', JobSchema)
