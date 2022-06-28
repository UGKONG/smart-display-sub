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
    <section className='today'>
      <h1>{item?.title ?? '-'}</h1>
      <h2>{data?.info?.LOCATION?.PATH3 ?? '-'} {date?.today}</h2>
      <div>
        <p>
          <span />
          <span>
            <span>오전</span>
            <span>오후</span>
          </span>
        </p>
        <p>
          <span>하늘상태</span>
          <span>
            <span>{data?.today?.min?.SKY_TEXT ?? '-'}</span>
            <span>{data?.today?.max?.SKY_TEXT ?? '-'}</span>
          </span>
        </p>
        <p>
          <span>기온</span>
          <span>
            <span>{data?.today?.min?.TMP ?? '-'}</span>
            <span>{data?.today?.max?.TMP ?? '-'}</span>
          </span>
        </p>
        <p>
          <span>강수확률</span>
          <span>
            <span>{data?.today?.min?.POP ?? '-'}</span>
            <span>{data?.today?.max?.POP ?? '-'}</span>
          </span>
        </p>
        <p>
          <span>미세먼지</span>
          <span>
            <span>{data?.today?.min?.PM10_TEXT ?? '-'}</span>
            <span>{data?.today?.max?.PM10_TEXT ?? '-'}</span>
          </span>
        </p>
        <p>
          <span>초미세먼지</span>
          <span>
            <span>{data?.today?.min?.PM25_TEXT ?? '-'}</span>
            <span>{data?.today?.max?.PM25_TEXT ?? '-'}</span>
          </span>
        </p>
      </div>
    </section>
  )
}