import styled from 'styled-components'

const Wrapper = styled.section`
  min-width: 0;
  padding: 2rem 1.5rem;
  border-radius: var(--borderRadius);
  background: var(--white);
  box-shadow: var(--shadow-2);
  text-align: center;
  button {
    background: transparent;
    border-color: transparent;
    text-transform: capitalize;
    color: var(--primary-500);
    font-size: 1.25rem;
    cursor: pointer;
  }
  h4 {
    text-align: center;
    margin-bottom: 0.75rem;
  }
`

export default Wrapper
