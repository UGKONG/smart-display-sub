import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import useStore from '%/useStore';
import img1 from '../img/dustImg/1.png';
import img2 from '../img/dustImg/2.png';
import img3 from '../img/dustImg/3.png';
import img4 from '../img/dustImg/4.png';

export default function ({ next, item }) {
  const navigate = useNavigate();
  const data = useStore(x => x.data);

  let pm = data?.now?.PM10_TEXT;
  let img = pm === '좋음' ? img1 : pm === '보통' ? img2 : pm === '나쁨' ? img3 : pm === '매우나쁨' ? img4 : null;

  const autoNextPage = () => {
    let timer = item?.timer ?? item?.defaultTimer ?? 5;
    let t = setTimeout(() => navigate(next), timer * 1000);
    console.log('현재: ' + item?.path + ', 다음: ' + next + ' (' + timer + '초 후 자동이동)');
    return () => clearTimeout(t);
  }
  useEffect(autoNextPage, []);

  const color = useMemo(() => {
    let val = data?.now?.PM10_TEXT;
    let result = '#fff';
    if (val === '좋음') result = '#2359c4';
    if (val === '보통') result = '#00b16b';
    if (val === '나쁨') result = '#ffd543';
    if (val === '매우나쁨') result = '#da3539';
    return result;
  }, [data?.now?.PM10_TEXT]);

  return (
    <section className='now'>
      <Title>{item?.title ?? '-'}</Title>
      <Img bg={img} />
      <SubTitle style={{ color, fontWeight: 700 }}>{data?.now?.PM10_TEXT ?? '-'}</SubTitle>
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
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  letter-spacing: 2px;
`