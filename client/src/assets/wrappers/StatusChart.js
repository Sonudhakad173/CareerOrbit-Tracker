import styled from 'styled-components'

const Wrapper = styled.section`
  min-width: 0;
  padding: 2rem 1.5rem;
  border-radius: var(--borderRadius);
  background: var(--white);
  box-shadow: var(--shadow-2);
  text-align: center;

  h4 {
    margin-bottom: 0.75rem;
  }
  .status-chart-content {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    align-items: center;
    gap: 0.5rem;
  }
  .status-donut {
    position: relative;
    min-width: 0;
    min-height: 260px;
  }
  .donut-total {
    position: absolute;
    top: 48%;
    left: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: translate(-50%, -50%);
    pointer-events: none;
    strong {
      color: var(--grey-900);
      font-size: 1.8rem;
      line-height: 1.1;
    }
    span {
      color: var(--grey-500);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
  }
  .empty-chart {
    display: grid;
    min-height: 260px;
    place-items: center;
    color: var(--grey-500);
  }
  .status-legend {
    margin: 0 auto;
    width: min(100%, 280px);
    li,
    .status-name {
      display: flex;
      align-items: center;
    }
    li {
      justify-content: space-between;
      padding: 0.55rem 0;
      border-top: 1px solid var(--grey-100);
    }
    .status-name {
      gap: 0.55rem;
      color: var(--grey-700);
    }
    strong {
      color: var(--grey-900);
    }
  }
  .legend-dot {
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 50%;
  }

  @media (min-width: 576px) {
    .status-chart-content {
      grid-template-columns: minmax(0, 1.25fr) minmax(150px, 0.75fr);
      gap: 1rem;
    }
  }
`

export default Wrapper
