import styled from 'styled-components'

const Wrapper = styled.article`
  background: var(--white);
  border-radius: var(--borderRadius);
  display: grid;
  grid-template-rows: 1fr auto;
  box-shadow: var(--shadow-2);

  header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--grey-100);
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    h5 {
      letter-spacing: 0;
    }
  }
  .main-icon {
    width: 60px;
    height: 60px;
    display: grid;
    place-items: center;
    background: var(--primary-500);
    border-radius: var(--borderRadius);
    font-size: 1.5rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--white);
    margin-right: 2rem;
  }
  .info {
    h5 {
      margin-bottom: 0.25rem;
    }
    p {
      margin: 0;
      text-transform: capitalize;
      color: var(--grey-400);
      letter-spacing: var(--letterSpacing);
    }
  }
  .pending {
    background: #fcefc7;
    color: #e9b949;
  }
  .interview {
    background: #e0e8f9;
    color: #647acb;
  }
  .declined {
    color: #d66a6a;
    background: #ffeeee;
  }
  .content {
    padding: 1rem 1.5rem;
  }
  .content-center {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 0.5rem;
    @media (min-width: 576px) {
      grid-template-columns: 1fr 1fr;
    }
    @media (min-width: 992px) {
      grid-template-columns: 1fr;
    }
    @media (min-width: 1120px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .status {
    border-radius: var(--borderRadius);
    text-transform: capitalize;
    letter-spacing: var(--letterSpacing);
    text-align: center;
    width: 100px;
    height: 30px;
  }
  .ats-summary {
    margin-top: 1.1rem;
    padding-top: 0.85rem;
    border-top: 1px solid var(--grey-100);
    .ats-source-note {
      display: block;
      margin: 0.35rem 0 0.55rem;
      color: var(--grey-500);
      line-height: 1.4;
    }
    .ats-summary-heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.4rem;
      strong {
        font-size: 0.9rem;
      }
      span {
        color: var(--primary-700);
        font-weight: 700;
      }
    }
    .ats-progress {
      height: 0.45rem;
      overflow: hidden;
      background: var(--grey-100);
      border-radius: 999px;
      span {
        display: block;
        height: 100%;
        background: var(--primary-500);
        border-radius: inherit;
      }
    }
    details {
      margin-top: 0.55rem;
      color: var(--grey-600);
      font-size: 0.85rem;
    }
    summary {
      cursor: pointer;
    }
    .ats-missing-keywords {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin-top: 0.5rem;
    }
    .ats-matched-keywords {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin-top: 0.5rem;
    }
    .ats-matched-keywords .keyword-chip {
      color: var(--green-dark);
      background: var(--green-light);
    }
    .keyword-chip {
      padding: 0.15rem 0.45rem;
      border-radius: 999px;
      color: var(--red-dark);
      background: var(--red-light);
      font-size: 0.78rem;
    }
  }
  footer {
    margin-top: 1rem;
  }
  .edit-btn,
  .delete-btn {
    letter-spacing: var(--letterSpacing);
    cursor: pointer;
    height: 30px;
  }
  .edit-btn {
    color: var(--green-dark);
    background: var(--green-light);
    margin-right: 0.5rem;
  }
  .delete-btn {
    color: var(--red-dark);
    background: var(--red-light);
  }
  &:hover .actions {
    visibility: visible;
  }
`

export default Wrapper
