import dotenv from 'dotenv';
import { randomBytes } from 'crypto';
import mongoose from 'mongoose';
import connectDB from '../db/connect.js';
import Job from '../models/Job.js';
import User from '../models/User.js';

dotenv.config();

const sampleJobs = [
  {
    position: 'Frontend Developer',
    company: 'Northstar Labs',
    jobLocation: 'Remote',
    jobType: 'full-time',
    status: 'interview',
    monthsAgo: 0,
    jobDescription:
      'Build accessible React interfaces, collaborate with product designers, and improve web performance.',
  },
  {
    position: 'Backend Engineer',
    company: 'Orbit Systems',
    jobLocation: 'Bengaluru',
    jobType: 'full-time',
    status: 'pending',
    monthsAgo: 0,
    jobDescription:
      'Develop Node.js APIs, work with MongoDB, and maintain reliable cloud services.',
  },
  {
    position: 'Product Engineer',
    company: 'Acme Digital',
    jobLocation: 'Remote',
    jobType: 'full-time',
    status: 'declined',
    monthsAgo: 1,
    jobDescription:
      'Ship customer-focused features with JavaScript, React, and cross-functional product teams.',
  },
  {
    position: 'Data Analyst',
    company: 'BluePeak Analytics',
    jobLocation: 'Pune',
    jobType: 'full-time',
    status: 'interview',
    monthsAgo: 2,
    jobDescription:
      'Analyze business data with SQL, build dashboards, and present findings to stakeholders.',
  },
  {
    position: 'Full Stack Developer',
    company: 'Cloudline',
    jobLocation: 'Remote',
    jobType: 'remote',
    status: 'pending',
    monthsAgo: 3,
    jobDescription:
      'Create web applications using React, Express, REST APIs, and automated tests.',
  },
  {
    position: 'UX Engineer',
    company: 'DesignForge',
    jobLocation: 'Mumbai',
    jobType: 'internship',
    status: 'declined',
    monthsAgo: 4,
    jobDescription:
      'Prototype responsive interfaces and improve usability with design and product teams.',
  },
];

const seedDemoAccount = async () => {
  const mongoUrl = process.env.MONGO_URL;
  const demoEmail = process.env.DEMO_EMAIL?.trim().toLowerCase();

  if (!mongoUrl) {
    throw new Error('MONGO_URL is required to seed the demo account.');
  }
  if (!demoEmail) {
    throw new Error('Set DEMO_EMAIL before seeding the demo account.');
  }

  await connectDB(mongoUrl);

  let demoUser = await User.findOne({ email: demoEmail });
  if (demoUser && !demoUser.isDemo) {
    throw new Error(
      'DEMO_EMAIL already belongs to a regular account. Choose a different demo email.'
    );
  }

  if (!demoUser) {
    demoUser = await User.create({
      name: 'Demo Candidate',
      email: demoEmail,
      password: randomBytes(32).toString('hex'),
      location: 'Remote',
      isDemo: true,
    });
    console.log('Created the demo account.');
  } else {
    console.log('Demo account already exists.');
  }

  const existingJobs = await Job.countDocuments({ createdBy: demoUser._id });
  if (existingJobs === 0) {
    const currentDate = new Date();
    const jobs = sampleJobs.map(({ monthsAgo, ...job }) => {
      const createdAt = new Date(currentDate);
      createdAt.setDate(10);
      createdAt.setMonth(createdAt.getMonth() - monthsAgo);
      createdAt.setHours(12, 0, 0, 0);

      return {
        ...job,
        createdBy: demoUser._id,
        createdAt,
        updatedAt: createdAt,
      };
    });

    await Job.insertMany(jobs);
    console.log(`Added ${jobs.length} sample applications.`);
  } else {
    console.log('Sample applications already exist; leaving them unchanged.');
  }
};

try {
  await seedDemoAccount();
} catch (error) {
  console.error(`Demo account setup failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
