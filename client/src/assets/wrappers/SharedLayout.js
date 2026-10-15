import styled from 'styled-components'

const Wrapper = styled.section`
  .dashboard {
    display: grid;
    grid-template-columns: 1fr;
  }
  .dashboard-page {
    width: 90vw;
    margin: 0 auto;
    padding: 2rem 0;
  }
  .demo-notice {
    margin-bottom: 1.25rem;
    padding: 0.85rem 1rem;
    border-radius: var(--borderRadius);
    background: var(--primary-100);
    color: var(--primary-700);
    line-height: 1.5;
  }
  @media (min-width: 992px) {
    .dashboard {
      grid-template-columns: auto 1fr;
    }
    .dashboard-page {
      width: 90%;
    }
  }
`
export default Wrapper
