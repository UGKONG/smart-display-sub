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
    <section className='text'>
      <h1>{item?.title ?? '-'}</h1>
      <h2>{date?.today}</h2>
      <div>{data?.text?.TEXT ?? '-'}</div>
    </section>
  )
}