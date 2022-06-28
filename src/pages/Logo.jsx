import React from 'react';
import Styled from 'styled-components';
import logo from '../img/logo.png';

export default function () {
  return (
    <Section className='logo'>
      <Logo src={logo} />
    </Section>
  )
}

const Section = Styled.section`
  justify-content: center;
`;
const Logo = Styled.img`
  display: block;
  width: 90%;
`