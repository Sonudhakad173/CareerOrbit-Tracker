import moment from 'moment'
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/Job'
import JobInfo from './JobInfo'

const Job = ({
  _id,
  position,
  company,
  jobLocation,
  jobType,
  createdAt,
  status,
  resumeAnalysis,
}) => {
  const { setEditJob, deleteJob, user } = useAppContext()

  let date = moment(createdAt)
  date = date.format('MMM Do, YYYY')
  return (
    <Wrapper>
      <header>
        <div className='main-icon'>{company.charAt(0)}</div>
        <div className='info'>
          <h5>{position}</h5>
          <p>{company}</p>
        </div>
      </header>
      <div className='content'>
        <div className='content-center'>
          <JobInfo icon={<FaLocationArrow />} text={jobLocation} />
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          <JobInfo icon={<FaBriefcase />} text={jobType} />
          <div className={`status ${status}`}>{status}</div>
        </div>
        {resumeAnalysis && (
          <section className='ats-summary' aria-label='Resume match results'>
            <div className='ats-summary-heading'>
              <strong>
                {resumeAnalysis.provider === 'gemini'
                  ? 'AI ATS match'
                  : resumeAnalysis.provider === 'local-fallback'
                  ? 'Local fallback match'
                  : 'ATS-style match'}
              </strong>
              <span>{resumeAnalysis.score}%</span>
            </div>
            {resumeAnalysis.provider === 'local-fallback' && (
              <small className='ats-source-note'>Gemini was unavailable; local keyword matching was used.</small>
            )}
            <div
              className='ats-progress'
              role='progressbar'
              aria-label='ATS compatibility score'
              aria-valuemin='0'
              aria-valuemax='100'
              aria-valuenow={resumeAnalysis.score}
            >
              <span style={{ width: `${resumeAnalysis.score}%` }} />
            </div>
            {!!resumeAnalysis.matchedKeywords?.length && (
              <details>
                <summary>{resumeAnalysis.matchedKeywords.length} matched keywords</summary>
                <div className='ats-matched-keywords'>
                  {resumeAnalysis.matchedKeywords.map((keyword) => (
                    <span className='keyword-chip' key={keyword}>{keyword}</span>
                  ))}
                </div>
              </details>
            )}
            <details>
              <summary>
                {resumeAnalysis.missingKeywords.length
                  ? `${resumeAnalysis.missingKeywords.length} missing keywords`
                  : 'No tracked keywords missing'}
              </summary>
              {!!resumeAnalysis.missingKeywords.length && (
                <div className='ats-missing-keywords'>
                  {resumeAnalysis.missingKeywords.map((keyword) => (
                    <span className='keyword-chip' key={keyword}>{keyword}</span>
                  ))}
                </div>
              )}
            </details>
          </section>
        )}
        {!user?.isDemo && (
          <footer>
            <div className='actions'>
              <Link
                to='/add-job'
                className='btn edit-btn'
                onClick={() => setEditJob(_id)}
              >
                Edit
              </Link>
              <button
                type='button'
                className='btn delete-btn'
                onClick={() => deleteJob(_id)}
              >
                Delete
              </button>
            </div>
          </footer>
        )}
      </div>
    </Wrapper>
  )
}

export default Job
