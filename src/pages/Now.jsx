import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '%/useStore';
import sunIcon from '@/img/skyIcon/sun.png';
import manyCloudIcon from '@/img/skyIcon/manyCloud.png';
import cloudIcon from '@/img/skyIcon/cloud.png';
import cloudSunIcon from '@/img/skyIcon/cloudSun.png';
import rainIcon from '@/img/skyIcon/rain.png';
import snowIcon from '@/img/skyIcon/snow.png';
import windIcon from '@/img/skyIcon/wind.png';
import dustIcon1 from '@/img/dustIcon/1.png';
import dustIcon2 from '@/img/dustIcon/2.png';
import dustIcon3 from '@/img/dustIcon/3.png';
import dustIcon4 from '@/img/dustIcon/4.png';
import useDate from '%/useDate';

export default function ({ next, item }) {
  const navigate = useNavigate();
  const date = useStore(x => x.date);
  const data = useStore(x => x.data);
  const [nowTime, setNowTime] = useState({ type: null, time: null });
  
  const autoNextPage = () => {
    let timer = item?.timer ?? item?.defaultTimer ?? 5;
    setTimeout(() => navigate(next), timer * 1000);
    console.log('현재: ' + item?.path + ', 다음: ' + next + ' (' + timer + '초 후 자동이동)');
  }

  const nowTimeFn = () => {
    let currentTime = useDate(undefined, 'time');
    let [h, m, s] = currentTime?.split(':');
    h = Number(h);
    let type = h >= 12 ? '오후' : '오전';
    h -= h > 12 ? 12 : 0;
    h = String(h < 10 ? '0' + h : h);
    let time = h + ':' + m + ':' + s;
    setNowTime({ type, time });
  };

  const SKY = useMemo(() => {
    let val = data?.now?.SKY;
    let result = null;
    if (val === 1) result = sunIcon;
    if (val === 3) result = manyCloudIcon;
    if (val === 4) result = cloudIcon;
    return result;
  }, [data?.now?.SKY]);
  const PM10 = useMemo(() => {
    let val = data?.now?.PM10_TEXT;
    let img = null;
    let color = '#fff';
    if (val === '좋음') { img = dustIcon1; color = '#2359c4'; }
    if (val === '보통') { img = dustIcon2; color = '#00b16b'; }
    if (val === '나쁨') { img = dustIcon3; color = '#ffd543'; }
    if (val === '매우나쁨') { img = dustIcon4; color = '#da3539'; }
    return { color, img };
  }, [data?.now?.PM10_TEXT]);
  const PM25 = useMemo(() => {
    let val = data?.now?.PM25_TEXT;
    let img = null;
    let color = '#fff';
    if (val === '좋음') { img = dustIcon1; color = '#2359c4'; }
    if (val === '보통') { img = dustIcon2; color = '#00b16b'; }
    if (val === '나쁨') { img = dustIcon3; color = '#ffd543'; }
    if (val === '매우나쁨') { img = dustIcon4; color = '#da3539'; }
    return { color, img };
  }, [data?.now?.PM25_TEXT]);

  useEffect(autoNextPage, []);
  useEffect(() => {
    nowTimeFn();
    let interval = setInterval(nowTimeFn, 500);
    return () => clearInterval(interval);
  })

  return (
    <section className='now'>
      <h1>{item?.title ?? '-'}</h1>
      <h2>{data?.info?.LOCATION?.PATH3 ?? '-'} {date?.today}</h2>
      <div>
        <p style={{ letterSpacing: 2, fontSize: 14, color: '#b0db26' }}>
          {nowTime?.type ?? ' '} {nowTime?.time ?? ' '}
        </p>
        <p>
          <span>하늘</span>
          <span>{SKY ? <img src={SKY} alt={data?.now?.SKY_TEXT} /> : '-'}</span>
        </p>
        <p>
          <span>기온</span>
          <span>{data?.now?.TMP_TEXT ?? '-'}</span>
        </p>
        <p>
          <span>오존</span>
          <span>{data?.now?.O3_TEXT ?? '-'}</span>
        </p>
        <p>
          <span style={{ color: PM10?.color }}>미세먼지</span>
          <span>{PM10?.img ? <img src={PM10?.img} alt={data?.now?.PM10_TEXT} /> : '-'}</span>
        </p>
        <p>
          <span style={{ color: PM25?.color }}>초미세먼지</span>
          <span>{PM25?.img ? <img src={PM25?.img} alt={data?.now?.PM25_TEXT} /> : '-'}</span>
        </p>
      </div>
    </section>
  )
}