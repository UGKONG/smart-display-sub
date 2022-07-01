import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import logo from '../img/logo.png';

export default function ({ next, item }) {
  const navigate = useNavigate();
  
  const autoNextPage = () => {
    let timer = item?.timer ?? item?.defaultTimer ?? 5;
    setTimeout(() => navigate(next), timer * 1000);
    console.log('현재: ' + item?.path + ', 다음: ' + next + ' (' + timer + '초 후 자동이동)');
  }
  useEffect(autoNextPage, []);

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
  width: 100%;
  height: 100%;
`