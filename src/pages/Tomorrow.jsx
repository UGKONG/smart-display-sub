import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  const [nowTime, setNowTime] = useState({ day: null });
  const dayList = useRef(['일','월','화','수','목','금','토']);
  
  const autoNextPage = () => {
    let timer = item?.timer ?? item?.defaultTimer ?? 5;
    setTimeout(() => navigate(next), timer * 1000);
    console.log('현재: ' + item?.path + ', 다음: ' + next + ' (' + timer + '초 후 자동이동)');
  }
  
  const nowTimeFn = () => {
    let currentDate = new Date();
    currentDate?.setDate(currentDate?.getDate() + 1);
    let day = dayList?.current[currentDate?.getDay()] ?? '-';
    setNowTime({ day });
  };

  const SKY = useMemo(() => {
    let { min, max } = data?.tomorrow;
    let minResult = null;
    let maxResult = null;
    if (min?.SKY === 1) minResult = sunIcon;
    if (min?.SKY === 3) minResult = cloudSunIcon;
    if (min?.SKY === 4) minResult = manyCloudIcon;
    if (max?.SKY === 1) maxResult = sunIcon;
    if (max?.SKY === 3) maxResult = cloudSunIcon;
    if (max?.SKY === 4) maxResult = manyCloudIcon;
    return { min: minResult, max: maxResult };
  }, [data?.tomorrow]);
  const PM10 = useMemo(() => {
    let { min, max } = data?.tomorrow;
    let minResult = null;
    let maxResult = null;
    if (min?.PM10_TEXT === '좋음') minResult = dustIcon1;
    if (min?.PM10_TEXT === '보통') minResult = dustIcon2;
    if (min?.PM10_TEXT === '나쁨') minResult = dustIcon3;
    if (min?.PM10_TEXT === '매우나쁨') minResult = dustIcon4;
    if (max?.PM10_TEXT === '좋음') maxResult = dustIcon1;
    if (max?.PM10_TEXT === '보통') maxResult = dustIcon2;
    if (max?.PM10_TEXT === '나쁨') maxResult = dustIcon3;
    if (max?.PM10_TEXT === '매우나쁨') maxResult = dustIcon4;
    return { min: minResult, max: maxResult };
  }, [data?.tomorrow]);
  const PM25 = useMemo(() => {
    let { min, max } = data?.tomorrow;
    let minResult = null;
    let maxResult = null;
    if (min?.PM25_TEXT === '좋음') minResult = dustIcon1;
    if (min?.PM25_TEXT === '보통') minResult = dustIcon2;
    if (min?.PM25_TEXT === '나쁨') minResult = dustIcon3;
    if (min?.PM25_TEXT === '매우나쁨') minResult = dustIcon4;
    if (max?.PM25_TEXT === '좋음') maxResult = dustIcon1;
    if (max?.PM25_TEXT === '보통') maxResult = dustIcon2;
    if (max?.PM25_TEXT === '나쁨') maxResult = dustIcon3;
    if (max?.PM25_TEXT === '매우나쁨') maxResult = dustIcon4;
    return { min: minResult, max: maxResult };
  }, [data?.tomorrow]);

  useEffect(autoNextPage, []);
  useEffect(() => {
    nowTimeFn();
    let interval = setInterval(nowTimeFn, 500);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className='tomorrow'>
      <h1>{item?.title ?? '-'}</h1>
      <h2>{data?.info?.LOCATION?.PATH3 ?? '-'} {date?.tomorrow} ({nowTime?.day})</h2>
      <div>
        <p>
          <span />
          <span>
            <span>오전</span>
            <span>오후</span>
          </span>
        </p>
        <p>
          <span>하늘</span>
          <span>
            <span>{SKY?.min ? <img src={SKY?.min} alt={data?.tomorrow?.min?.SKY_TEXT} /> : '-'}</span>
            <span>{SKY?.max ? <img src={SKY?.max} alt={data?.tomorrow?.max?.SKY_TEXT} /> : '-'}</span>
          </span>
        </p>
        <p>
          <span>기온</span>
          <span>
            <span>{data?.tomorrow?.min?.TMP_TEXT ?? '-'}</span>
            <span>{data?.tomorrow?.max?.TMP_TEXT ?? '-'}</span>
          </span>
        </p>
        <p>
          <span>강수</span>
          <span>
            <span>{data?.tomorrow?.min?.POP_TEXT ?? '-'}</span>
            <span>{data?.tomorrow?.max?.POP_TEXT ?? '-'}</span>
          </span>
        </p>
        <p>
          <span style={{ color: '#ffd543' }}>미세먼지</span>
          <span>
            <span>{PM10?.min ? <img src={PM10?.min} alt={data?.tomorrow?.min?.PM10_TEXT} /> : '-'}</span>
            <span>{PM10?.max ? <img src={PM10?.max} alt={data?.tomorrow?.max?.PM10_TEXT} /> : '-'}</span>
          </span>
        </p>
        <p>
          <span style={{ color: '#ffd543' }}>초미세먼지</span>
          <span>
            <span>{PM25?.min ? <img src={PM25?.min} alt={data?.tomorrow?.min?.PM25_TEXT} /> : '-'}</span>
            <span>{PM25?.max ? <img src={PM25?.max} alt={data?.tomorrow?.max?.PM25_TEXT} /> : '-'}</span>
          </span>
        </p>
      </div>
    </section>
  )
}