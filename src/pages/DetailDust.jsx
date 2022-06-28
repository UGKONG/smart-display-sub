import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import useStore from '%/useStore';
import img1 from '../img/dustIcon/1.png';
import img2 from '../img/dustIcon/2.png';
import img3 from '../img/dustIcon/3.png';
import img4 from '../img/dustIcon/4.png';

export default function ({ next, item }) {
  const navigate = useNavigate();
  const data = useStore(x => x.data);

  let pm = data?.now?.PM25_TEXT;
  let img = pm === '좋음' ? img1 : pm === '보통' ? img2 : pm === '나쁨' ? img3 : pm === '매우나쁨' ? img4 : null;

  const autoNextPage = () => {
    let timer = item?.timer ?? item?.defaultTimer ?? 5;
    setTimeout(() => navigate(next), timer * 1000);
    console.log('현재: ' + item?.path + ', 다음: ' + next + ' (' + timer + '초 후 자동이동)');
  }
  useEffect(autoNextPage, []);

  return (
    <section className='now'>
      <Title>{item?.title ?? '-'}</Title>
      <Img bg={img} />
      <SubTitle>{data?.now?.PM25_TEXT ?? '-'}</SubTitle>
    </section>
  )
}

const Title = Styled.h1`
  font-size: 18px;
  word-break: keep-all;
  line-height: 24px;
`;
const Img = Styled.div`
  padding: 0;
  height: calc(100% - 100px);
  background-color: transparent;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  background-image: url(${x => x.bg});
`;
const SubTitle = Styled.h2`
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`