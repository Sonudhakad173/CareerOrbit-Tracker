import styled from 'styled-components'

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.5rem;
  margin-top: 4rem;

  @media (min-width: 992px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  &.single-chart {
    @media (min-width: 992px) {
      grid-template-columns: minmax(0, 680px);
      justify-content: center;
    }
  }
`

export default Wrapper
