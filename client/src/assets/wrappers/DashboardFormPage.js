import styled from 'styled-components'

const Wrapper = styled.section`
  border-radius: var(--borderRadius);
  width: 100%;
  background: var(--white);
  padding: 3rem 2rem 4rem;
  box-shadow: var(--shadow-2);
  h3 {
    margin-top: 0;
  }
  .form {
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    max-width: 100%;
    width: 100%;
  }
  .form-row {
    margin-bottom: 0;
  }
  .form-center {
    display: grid;
    row-gap: 0.5rem;
  }
  .full-row {
    grid-column: 1 / -1;
  }
  .job-description-input {
    min-height: 9rem;
    resize: vertical;
  }
  .field-hint {
    display: block;
    color: var(--grey-500);
    line-height: 1.5;
    margin-top: 0.35rem;
  }
  .optional-label {
    color: var(--grey-500);
    font-size: 0.8em;
    text-transform: lowercase;
  }
  .file-input {
    height: auto;
    min-height: 42px;
    padding: 0.45rem 0.65rem;
  }
  .selected-file {
    display: block;
    margin-top: 0.5rem;
    color: var(--grey-700);
  }
  .analysis-result {
    margin-top: 1rem;
    padding: 1rem;
    border: 1px solid var(--grey-100);
    border-radius: var(--borderRadius);
    background: var(--grey-50);
  }
  .analysis-heading {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    strong,
    small {
      display: block;
    }
    small {
      color: var(--grey-600);
      margin-top: 0.2rem;
    }
  }
  .analysis-score {
    display: grid;
    place-items: center;
    flex: 0 0 3.75rem;
    width: 3.75rem;
    height: 3.75rem;
    border-radius: 50%;
    background: var(--primary-100);
    color: var(--primary-800);
    font-size: 1.15rem;
    font-weight: 700;
  }
  .keyword-list {
    margin-top: 1rem;
    strong {
      display: block;
      margin-bottom: 0.4rem;
    }
  }
  .keyword-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }
  .keyword-chip {
    padding: 0.2rem 0.55rem;
    border-radius: 999px;
    color: var(--red-dark);
    background: var(--red-light);
    font-size: 0.82rem;
  }
  .keyword-chip-matched {
    color: var(--green-dark);
    background: var(--green-light);
  }
  .form-center button {
    align-self: end;
    height: 35px;
    margin-top: 1rem;
  }
  .btn-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1rem;
    align-self: flex-end;
    margin-top: 0.5rem;
    button {
      height: 35px;
    }
  }
  .clear-btn {
    background: var(--grey-500);
  }
  .clear-btn:hover {
    background: var(--black);
  }
  @media (min-width: 992px) {
    .form-center {
      grid-template-columns: 1fr 1fr;
      align-items: center;
      column-gap: 1rem;
    }
    .btn-container {
      margin-top: 0;
    }
  }
  @media (min-width: 1120px) {
    .form-center {
      grid-template-columns: 1fr 1fr 1fr;
    }
    .form-center button {
      margin-top: 0;
    }
  }
`

export default Wrapper
