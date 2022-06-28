import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '%/useStore';

export default function ({ next, item }) {
  const navigate = useNavigate();
  const date = useStore(x => x.date);
  const data = useStore(x => x.data);
  
  const autoNextPage = () => {
    let timer = item?.timer ?? item?.defaultTimer ?? 5;
    setTimeout(() => navigate(next), timer * 1000);
    console.log('현재: ' + item?.path + ', 다음: ' + next + ' (' + timer + '초 후 자동이동)');
  }
  useEffect(autoNextPage, []);

  return (
    <section className='now'>
      <h1>{item?.title ?? '-'}</h1>
      <h2>{data?.info?.LOCATION?.PATH3 ?? '-'} {date?.today}</h2>
      <div>
        <p>
          <span>하늘상태</span>
          <span>{data?.now?.SKY_TEXT ?? '-'}</span>
        </p>
        <p>
          <span>현재기온</span>
          <span>{data?.now?.TMP_TEXT ?? '-'}</span>
        </p>
        <p>
          <span>미세먼지</span>
          <span>{data?.now?.PM10_TEXT ?? '-'}</span>
        </p>
        <p>
          <span>초미세먼지</span>
          <span>{data?.now?.PM25_TEXT ?? '-'}</span>
        </p>
        <p>
          <span>오존</span>
          <span>{data?.now?.O3 ?? '-'}</span>
        </p>
      </div>
    </section>
  )
}