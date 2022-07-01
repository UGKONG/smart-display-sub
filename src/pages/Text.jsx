import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '%/useStore';

export default function ({ next, item }) {
  const navigate = useNavigate();
  const date = useStore(x => x.date);
  const data = useStore(x => x.data);
  const [nowTime, setNowTime] = useState({ day: null });
  const dayList = useRef(['일','월','화','수','목','금','토']);
  
  const autoNextPage = () => {
    let timer = item?.timer ?? item?.defaultTimer ?? 5;
    setTimeout(() => navigate(next), timer * 1000);
    console.log('현재: ' + item?.path + ', 다음: ' + next + ' (' + timer + '초 후 자동이동)');
  }
  
  const nowTimeFn = () => {
    let currentDate = new Date();
    let day = dayList?.current[currentDate?.getDay()] ?? '-';
    setNowTime({ day });
  };

  useEffect(autoNextPage, []);
  useEffect(() => {
    nowTimeFn();
    let interval = setInterval(nowTimeFn, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className='text'>
      <h1>{item?.title ?? '-'}</h1>
      <h2>{date?.today} ({nowTime?.day})</h2>
      <div>{data?.text?.TEXT ?? '-'}</div>
    </section>
  )
}