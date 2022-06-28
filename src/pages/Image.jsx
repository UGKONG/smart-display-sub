import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import conf from '../../config.json';
import useStore from '%/useStore';

export default function ({ next, item }) {
  const navigate = useNavigate();

  const autoNextPage = () => {
    let timer = item?.timer ?? item?.defaultTimer ?? 5;
    setTimeout(() => navigate(next), timer * 1000);
    console.log('현재: ' + item?.path + ', 다음: ' + next + ' (' + timer + '초 후 자동이동)');
  }
  useEffect(autoNextPage, []);
  

  return (
    <Section bg={item?.mediaURL} />
  )
}

const Section = Styled.section`
  background-color: transparent;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  background-image: url(${x => x.bg});
`