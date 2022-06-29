import React, { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '%/useStore';
import useDate from '%/useDate';
import sunIcon from '@/img/skyIcon/sun.png';
import manyCloudIcon from '@/img/skyIcon/manyCloud.png';
import cloudIcon from '@/img/skyIcon/cloud.png';
import cloudSunIcon from '@/img/skyIcon/cloudSun.png';
import rainIcon from '@/img/skyIcon/rain.png';
import snowIcon from '@/img/skyIcon/snow.png';
import windIcon from '@/img/skyIcon/wind.png';

export default function ({ next, item }) {
  const navigate = useNavigate();
  const data = useStore(x => x.data);
  const dayList = useRef(['일', '월', '화', '수', '목', '금', '토']);
  
  const autoNextPage = () => {
    let timer = item?.timer ?? item?.defaultTimer ?? 5;
    setTimeout(() => navigate(next), timer * 1000);
    console.log('현재: ' + item?.path + ', 다음: ' + next + ' (' + timer + '초 후 자동이동)');
  }

  const dateToDay = useCallback(dt => {
    if (!dt) return '-';
    let date = new Date(dt);
    let day = date?.getDay();
    return dayList?.current[day];
  })
  
  const SKY = useCallback(val => {
    let result = null;
    if (val === 1) result = sunIcon;
    if (val === 3) result = manyCloudIcon;
    if (val === 4) result = cloudIcon;
    return result;
  }, [data?.week]);

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
            <span>{dateToDay(item.DATE)}</span>
            <span>{SKY(item?.SKY) ? <img style={iconStyle} src={SKY(item?.SKY)} alt={item?.SKY_TEXT} /> : '-'}</span>
            <span>{item?.MIN ?? '-'}/{item?.MAX ?? '-'}</span>
            <span>{item.RAIN ?? '-'}</span>
          </p>
        ))}
      </div>
    </section>
  )
}

const iconStyle = {
  maxWidth: 24,
  height: 18,
}