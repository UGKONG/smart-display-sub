import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '%/useStore';
import dustIcon1 from '@/img/dustIcon/1.png';
import dustIcon2 from '@/img/dustIcon/2.png';
import dustIcon3 from '@/img/dustIcon/3.png';
import dustIcon4 from '@/img/dustIcon/4.png';
import sky_1_icon from '@/img/skyIcon/1.png';
import sky_3_icon from '@/img/skyIcon/3.png';
import sky_3_1_icon from '@/img/skyIcon/3-1.png';
import sky_3_2_icon from '@/img/skyIcon/3-2.png';
import sky_4_icon from '@/img/skyIcon/4.png';
import sky_4_1_icon from '@/img/skyIcon/4-1.png';
import sky_4_2_icon from '@/img/skyIcon/4-2.png';

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

  const SKY = useMemo(() => {
    let { min, max } = data?.today;
    let minResult = null;
    let maxResult = null;
    if (min?.SKY === 1) minResult = sky_1_icon;
    if (min?.SKY === 3) minResult = sky_3_icon;
    if (min?.SKY === 3 && (val?.PTY === 1 || val?.PTY === 2 || val?.PTY === 4 || val?.PTY === 5 || val?.PTY === 6) && min?.POP >= 50) minResult = sky_3_1_icon;
    if (min?.SKY === 3 && (val?.PTY === 3 || val?.PTY === 7) && min?.POP >= 50) minResult = sky_3_2_icon;
    if (min?.SKY === 4) minResult = sky_4_icon;
    if (min?.SKY === 4 && (val?.PTY === 1 || val?.PTY === 2 || val?.PTY === 4 || val?.PTY === 5 || val?.PTY === 6) && min?.POP >= 50) minResult = sky_4_1_icon;
    if (min?.SKY === 4 && (val?.PTY === 3 || val?.PTY === 7) && min?.POP >= 50) minResult = sky_4_2_icon;

    if (max?.SKY === 1) maxResult = sky_1_icon;
    if (max?.SKY === 3) maxResult = sky_3_icon;
    if (max?.SKY === 3 && (val?.PTY === 1 || val?.PTY === 2 || val?.PTY === 4 || val?.PTY === 5 || val?.PTY === 6) && max?.POP >= 50) maxResult = sky_3_1_icon;
    if (max?.SKY === 3 && (val?.PTY === 3 || val?.PTY === 7) && max?.POP >= 50) maxResult = sky_3_1_icon;
    if (max?.SKY === 4) maxResult = sky_4_icon;
    if (max?.SKY === 4 && (val?.PTY === 1 || val?.PTY === 2 || val?.PTY === 4 || val?.PTY === 5 || val?.PTY === 6) && max?.POP >= 50) maxResult = sky_4_1_icon;
    if (max?.SKY === 4 && (val?.PTY === 3 || val?.PTY === 7) && max?.POP >= 50) maxResult = sky_4_1_icon;
    return { min: minResult, max: maxResult };
  }, [data?.today]);
  const PM10 = useMemo(() => {
    let { min, max } = data?.today;
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
  }, [data?.today]);
  const PM25 = useMemo(() => {
    let { min, max } = data?.today;
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
  }, [data?.today]);

  useEffect(autoNextPage, [next, item]);
  useEffect(() => {
    nowTimeFn();
    let interval = setInterval(nowTimeFn, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className='today'>
      <h1>{item?.title ?? '-'}</h1>
      <h2>{data?.info?.LOCATION?.PATH3 ?? '-'} {date?.today} ({nowTime?.day})</h2>
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
            <span>{SKY?.min ? <img src={SKY?.min} alt={data?.today?.min?.SKY_TEXT} /> : '-'}</span>
            <span>{SKY?.max ? <img src={SKY?.max} alt={data?.today?.max?.SKY_TEXT} /> : '-'}</span>
          </span>
        </p>
        <p>
          <span>기온</span>
          <span>
            <span>{data?.today?.min?.TMP_TEXT ?? '-'}</span>
            <span>{data?.today?.max?.TMP_TEXT ?? '-'}</span>
          </span>
        </p>
        <p>
          <span>강수</span>
          <span>
            <span>{data?.today?.min?.POP_TEXT ?? '-'}</span>
            <span>{data?.today?.max?.POP_TEXT ?? '-'}</span>
          </span>
        </p>
        <p>
          <span style={{ color: '#ffd543' }}>미세먼지</span>
          <span>
            <span>{PM10?.min ? <img src={PM10?.min} alt={data?.today?.min?.PM10_TEXT} /> : '-'}</span>
            <span>{PM10?.max ? <img src={PM10?.max} alt={data?.today?.max?.PM10_TEXT} /> : '-'}</span>
          </span>
        </p>
        <p>
          <span style={{ color: '#ffd543' }}>초미세먼지</span>
          <span>
            <span>{PM25?.min ? <img src={PM25?.min} alt={data?.today?.min?.PM25_TEXT} /> : '-'}</span>
            <span>{PM25?.max ? <img src={PM25?.max} alt={data?.today?.max?.PM25_TEXT} /> : '-'}</span>
          </span>
        </p>
      </div>
    </section>
  )
}