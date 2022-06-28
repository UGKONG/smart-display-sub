import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '%/useStore';
import useDate from '%/useDate';

export default function ({ next, item }) {
  const navigate = useNavigate();
  const data = useStore(x => x.data);
  
  const autoNextPage = () => {
    let timer = item?.timer ?? item?.defaultTimer ?? 5;
    setTimeout(() => navigate(next), timer * 1000);
    console.log('현재: ' + item?.path + ', 다음: ' + next + ' (' + timer + '초 후 자동이동)');
  }
  useEffect(autoNextPage, []);

  return (
    <section className='week'>
      <h1>{item?.title ?? '-'}</h1>
      <h2>{data?.info?.LOCATION?.PATH3 ?? '-'}</h2>
      <div>
        <p>
          <span></span>
          <span></span>
          <span>🌡<small>(℃)</small></span>
          <span>💧<small>(%)</small></span>
        </p>

        {(data?.week ?? []).map(item => (
          <p key={item.DATE}>
            <span>{useDate(item.DATE, 'dateMD')}</span>
            <span>{item?.SKY ?? '-'}</span>
            <span>{item?.MIN ?? '-'}/{item?.MAX ?? '-'}</span>
            <span>{item.RAIN ?? '-'}</span>
          </p>
        ))}
      </div>
    </section>
  )
}