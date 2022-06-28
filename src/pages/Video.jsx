import React, { useEffect } from 'react';
import Styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export default function ({ next, item }) {
  const navigate = useNavigate();
  
  const autoNextPage = () => {
    let timer = item?.timer || item?.defaultTimer || 5;
    setTimeout(() => navigate(next), timer * 1000);
    console.log('현재: ' + item?.path + ', 다음: ' + next + ' (' + timer + '초 후 자동이동)');
  }
  useEffect(autoNextPage, []);

  return (
    <section className='video'>
      <Video src={item?.mediaURL} loop muted autoPlay={true} />
    </section>
  )
}

const Video = Styled.video`
  width: 100%;
  height: 100%;
`;