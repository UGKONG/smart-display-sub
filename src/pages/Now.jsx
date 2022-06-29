import React, { useEffect, useMemo } from 'react';
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

export default function ({ next, item }) {
  const navigate = useNavigate();
  const date = useStore(x => x.date);
  const data = useStore(x => x.data);
  
  const autoNextPage = () => {
    let timer = item?.timer ?? item?.defaultTimer ?? 5;
    setTimeout(() => navigate(next), timer * 1000);
    console.log('현재: ' + item?.path + ', 다음: ' + next + ' (' + timer + '초 후 자동이동)');
  }

  const nowTime = useMemo(() => {
    let currentTime = data?.info?.NOW?.split(' ')[1]?.slice(0, 5);
    let [h, m] = currentTime?.split(':');
    h = Number(h);
    let type = h >= 12 ? 'PM' : 'AM';
    h -= h > 12 ? 12 : 0;
    h = String(h < 10 ? '0' + h : h);
    let time = h + ':' + m;
    return { type, time };
  }, [data?.info?.NOW]);

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
    let result = null;
    if (val === '좋음') result = dustIcon1;
    if (val === '보통') result = dustIcon2;
    if (val === '나쁨') result = dustIcon3;
    if (val === '매우나쁨') result = dustIcon4;
    return result;
  }, [data?.now?.PM10_TEXT]);
  const PM25 = useMemo(() => {
    let val = data?.now?.PM25_TEXT;
    let result = null;
    if (val === '좋음') result = dustIcon1;
    if (val === '보통') result = dustIcon2;
    if (val === '나쁨') result = dustIcon3;
    if (val === '매우나쁨') result = dustIcon4;
    return result;
  }, [data?.now?.PM25_TEXT]);

  useEffect(autoNextPage, []);

  return (
    <section className='now'>
      <h1>{item?.title ?? '-'}</h1>
      <h2>{data?.info?.LOCATION?.PATH3 ?? '-'} {date?.today}</h2>
      <div>
        <p style={{ letterSpacing: 2, fontSize: 14 }}>
          {nowTime?.type} {nowTime?.time}
        </p>
        <p>
          <span>하늘</span>
          {/* <span>{data?.now?.SKY_TEXT ?? '-'}</span> */}
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
          <span>미세먼지</span>
          {/* <span>{data?.now?.PM10_TEXT ?? '-'}</span> */}
          <span>{PM10 ? <img src={PM10} alt={data?.now?.PM10_TEXT} /> : '-'}</span>
        </p>
        <p>
          <span>초미세먼지</span>
          {/* <span>{data?.now?.PM25_TEXT ?? '-'}</span> */}
          <span>{PM25 ? <img src={PM25} alt={data?.now?.PM25_TEXT} /> : '-'}</span>
        </p>
      </div>
    </section>
  )
}