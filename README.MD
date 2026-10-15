# 🚀 CareerOrbit Tracker


> A full-stack job application tracker with visual analytics and an AI-assisted resume matcher.


---


## 🌟 Key Features

- **Visual dashboard:** Recharts donut charts for application status and area charts for monthly trends.

- **AI ATS-style resume matching:** Gemini compares a resume with a job description and returns a score, matched keywords, 
    and missing skills. A local keyword matcher provides a fallback when Gemini is unavailable.

- **PDF processing:** Upload text-based PDF resumes (up to 5 MB). Files are analyzed in memory and are not saved by the  
    app.

- **Job tracking:** Create, view, update, delete, filter, and sort applications by status.

- **Authentication:** JWT-based sign-in and protected API routes.



## 🛠️ Tech Stack

**Frontend:** React.js (Create React App), React Router, Context API, Axios, Styled Components, CSS, Recharts.

**Backend:** Node.js, Express.js, MongoDB, Mongoose, Multer, pdf-parse.

**AI:** Google Gemini through `@google/genai`, with a custom JavaScript keyword-matching fallback. The model is  
  configurable; the environment example below selects Gemini 2.5 Flash.



## ⚙️ Environment Setup

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
GEMINI_RESUME_MODEL=gemini-2.5-flash
```
