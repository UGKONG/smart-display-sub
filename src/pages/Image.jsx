import React, { useEffect, useMemo } from 'react';
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
  
  const media = useMemo(() => {
    let name = item?.mediaURL;
    name = name?.split('/');
    name = name[name?.length - 1];
    return name;
  }, [item?.mediaURL]);

  useEffect(autoNextPage, [next, item]);
  
  return (
    <Section bg={media} />
  )
}

const Section = Styled.section`
  background-color: transparent;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  background-image: url(/public/files/${x => x.bg});
`