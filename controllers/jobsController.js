import Job from '../models/Job.js';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from '../errors/index.js';
import checkPermissions from '../utils/checkPermissions.js';
import mongoose from 'mongoose';
import moment from 'moment';
import pdfParse from 'pdf-parse';
import { analyzeResumeAgainstJobDescription } from '../utils/atsMatcher.js';

const getResumeAnalysis = async (req, jobDescription) => {
  if (!req.file) return undefined;
  if (!jobDescription?.trim()) {
    throw new BadRequestError('Add a job description to compare against the resume.');
  }
  if (!req.file.buffer.subarray(0, 5).equals(Buffer.from('%PDF-'))) {
    throw new BadRequestError('This file is not a valid PDF. Please upload a PDF resume.');
  }

  let parsedPdf;
  try {
    parsedPdf = await pdfParse(req.file.buffer, { max: 20 });
  } catch (error) {
    throw new BadRequestError('We could not read this PDF. Try an unlocked, text-based resume.');
  }

  const resumeText = parsedPdf.text?.replace(/\s+/g, ' ').trim();
  if (!resumeText || resumeText.length < 20) {
    throw new BadRequestError(
      'This PDF has no selectable text. Upload a text-based resume instead of a scanned image.'
    );
  }

  return analyzeResumeAgainstJobDescription(resumeText, jobDescription);
};

const createJob = async (req, res) => {
  const {
    position,
    company,
    jobLocation,
    jobType,
    status,
    jobDescription = '',
  } = req.body;

  if (!position || !company) {
    throw new BadRequestError('Please provide all values');
  }
  if (typeof jobDescription !== 'string') {
    throw new BadRequestError('Job description must be text.');
  }
  if (jobDescription.length > 10000) {
    throw new BadRequestError('Job description must be 10,000 characters or fewer.');
  }
  const resumeAnalysis = await getResumeAnalysis(req, jobDescription);
  const job = await Job.create({
    position,
    company,
    jobLocation,
    jobType,
    status,
    jobDescription,
    resumeAnalysis,
    createdBy: req.user.userId,
  });
  res.status(StatusCodes.CREATED).json({ job });
};
const getAllJobs = async (req, res) => {
  const { status, jobType, sort, search } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };
  // add stuff based on condition

  if (status && status !== 'all') {
    queryObject.status = status;
  }
  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: 'i' };
  }
  // NO AWAIT

  let result = Job.find(queryObject);

  // chain sort conditions

  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }
  if (sort === 'a-z') {
    result = result.sort('position');
  }
  if (sort === 'z-a') {
    result = result.sort('-position');
  }

  //

  // setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const jobs = await result;

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
};
const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const {
    company,
    position,
    jobLocation,
    jobType,
    status,
    jobDescription = '',
  } = req.body;

  if (!position || !company) {
    throw new BadRequestError('Please provide all values');
  }
  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id :${jobId}`);
  }
  // check permissions

  checkPermissions(req.user, job.createdBy);

  if (typeof jobDescription !== 'string') {
    throw new BadRequestError('Job description must be text.');
  }
  if (jobDescription.length > 10000) {
    throw new BadRequestError('Job description must be 10,000 characters or fewer.');
  }
  const resumeAnalysis = await getResumeAnalysis(req, jobDescription);
  const update = {
    company,
    position,
    jobLocation,
    jobType,
    status,
    jobDescription,
  };
  if (resumeAnalysis) {
    update.resumeAnalysis = resumeAnalysis;
  } else if (job.jobDescription !== jobDescription) {
    // A score based on the previous description would be misleading.
    update.resumeAnalysis = null;
  }

  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, update, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ updatedJob });
};
const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id :${jobId}`);
  }

  checkPermissions(req.user, job.createdBy);

  await job.remove();

  res.status(StatusCodes.OK).json({ msg: 'Success! Job removed' });
};
const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM Y');
      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats };
