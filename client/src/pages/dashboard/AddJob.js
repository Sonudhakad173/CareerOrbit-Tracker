import { useRef, useState } from 'react'
import { FormRow, FormRowSelect, Alert } from '../../components'
import { useAppContext } from '../../context/appContext'
import Wrapper from '../../assets/wrappers/DashboardFormPage'

const AddJob = () => {
  const {
    isLoading,
    isEditing,
    showAlert,
    displayAlert,
    position,
    company,
    jobLocation,
    jobDescription,
    resumeAnalysis,
    jobType,
    jobTypeOptions,
    status,
    statusOptions,
    handleChange,
    clearValues,
    createJob,
    editJob,
  } = useAppContext()
  const [resumeFile, setResumeFile] = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [resumeError, setResumeError] = useState('')
  const resumeInput = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!position || !company || !jobLocation) {
      displayAlert()
      return
    }
    if (resumeFile && !jobDescription.trim()) {
      setResumeError('Add a job description before analyzing your resume.')
      return
    }
    if (isEditing) {
      const updatedJob = await editJob(resumeFile)
      if (updatedJob) {
        setAnalysisResult(updatedJob.resumeAnalysis || null)
        setResumeFile(null)
        if (resumeInput.current) resumeInput.current.value = ''
      }
      return
    }
    const createdJob = await createJob(resumeFile)
    if (createdJob) {
      setAnalysisResult(createdJob.resumeAnalysis || null)
      setResumeFile(null)
      if (resumeInput.current) resumeInput.current.value = ''
    }
  }
  const handleJobInput = (e) => {
    const name = e.target.name
    const value = e.target.value
    handleChange({ name, value })
  }

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0] || null
    setResumeError('')
    setAnalysisResult(null)
    if (!file) {
      setResumeFile(null)
      return
    }
    if (!file.name.toLowerCase().endsWith('.pdf') || file.type !== 'application/pdf') {
      setResumeError('Choose a PDF file to analyze your resume.')
      setResumeFile(null)
      e.target.value = ''
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setResumeError('Resume PDF must be 5 MB or smaller.')
      setResumeFile(null)
      e.target.value = ''
      return
    }
    setResumeFile(file)
  }

  const displayedAnalysis = analysisResult || resumeAnalysis

  return (
    <Wrapper>
      <form className='form' onSubmit={handleSubmit}>
        <h3>{isEditing ? 'edit job' : 'add job'}</h3>
        {showAlert && <Alert />}
        <div className='form-center'>
          {/* position */}
          <FormRow
            type='text'
            name='position'
            value={position}
            handleChange={handleJobInput}
          />
          {/* company */}
          <FormRow
            type='text'
            name='company'
            value={company}
            handleChange={handleJobInput}
          />
          {/* location */}
          <FormRow
            type='text'
            labelText='job location'
            name='jobLocation'
            value={jobLocation}
            handleChange={handleJobInput}
          />
          <div className='form-row full-row'>
            <label htmlFor='jobDescription' className='form-label'>
              job description
            </label>
            <textarea
              id='jobDescription'
              name='jobDescription'
              value={jobDescription}
              onChange={handleJobInput}
              className='form-textarea job-description-input'
              maxLength={10000}
              placeholder='Paste the job description here to compare it with your resume.'
            />
          </div>
          <div className='form-row full-row resume-upload'>
            <label htmlFor='resume' className='form-label'>
              AI resume matcher <span className='optional-label'>optional</span>
            </label>
            <input
              ref={resumeInput}
              id='resume'
              name='resume'
              type='file'
              accept='.pdf,application/pdf'
              onChange={handleResumeChange}
              className='form-input file-input'
            />
            {resumeFile && <small className='selected-file'>{resumeFile.name}</small>}
            {resumeError && <small className='form-alert'>{resumeError}</small>}
            {resumeFile && !jobDescription.trim() && (
              <small className='form-alert'>Add a job description before uploading a resume.</small>
            )}
            {displayedAnalysis && (
              <div className='analysis-result' aria-live='polite'>
                <div className='analysis-heading'>
                  <span className='analysis-score'>{displayedAnalysis.score}%</span>
                  <div>
                    <strong>
                      {displayedAnalysis.provider === 'gemini'
                        ? 'AI ATS-style score'
                        : displayedAnalysis.provider === 'local-fallback'
                        ? 'Local fallback score'
                        : 'ATS-style score'}
                    </strong>
                    {displayedAnalysis.provider === 'local-fallback' ? (
                      <small>Gemini was unavailable, so local keyword matching produced this estimate.</small>
                    ) : displayedAnalysis.provider === 'gemini' ? null : (
                      <small>
                        Matched {displayedAnalysis.matchedKeywords.length} of{' '}
                        {displayedAnalysis.matchedKeywords.length + displayedAnalysis.missingKeywords.length} tracked keywords.
                      </small>
                    )}
                  </div>
                </div>
                <div className='keyword-list'>
                  <strong>Matched keywords</strong>
                  {displayedAnalysis.matchedKeywords.length ? (
                    <div className='keyword-chips'>
                      {displayedAnalysis.matchedKeywords.map((keyword) => (
                        <span className='keyword-chip keyword-chip-matched' key={keyword}>{keyword}</span>
                      ))}
                    </div>
                  ) : (
                    <small>No clear matches found.</small>
                  )}
                </div>
                <div className='keyword-list'>
                  <strong>Missing keywords</strong>
                  {displayedAnalysis.missingKeywords.length ? (
                    <div className='keyword-chips'>
                      {displayedAnalysis.missingKeywords.map((keyword) => (
                        <span className='keyword-chip' key={keyword}>{keyword}</span>
                      ))}
                    </div>
                  ) : (
                    <small>No tracked keywords are missing.</small>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* job status */}
          <FormRowSelect
            name='status'
            value={status}
            handleChange={handleJobInput}
            list={statusOptions}
          />
          {/* job type */}
          <FormRowSelect
            name='jobType'
            labelText='job type'
            value={jobType}
            handleChange={handleJobInput}
            list={jobTypeOptions}
          />
          {/* btn container */}
          <div className='btn-container'>
            <button
              type='submit'
              className='btn btn-block submit-btn'
              disabled={isLoading}
            >
              submit
            </button>
            <button
              className='btn btn-block clear-btn'
              onClick={(e) => {
                e.preventDefault()
                clearValues()
                setResumeFile(null)
                setAnalysisResult(null)
                setResumeError('')
                if (resumeInput.current) resumeInput.current.value = ''
              }}
            >
              clear
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  )
}

export default AddJob
