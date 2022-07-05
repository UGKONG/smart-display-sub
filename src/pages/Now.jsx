import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '%/useStore';
import useDate from '%/useDate';
import sky_1_icon from '@/img/skyIcon/1.png';
import sky_3_icon from '@/img/skyIcon/3.png';
import sky_3_1_icon from '@/img/skyIcon/3-1.png';
import sky_3_2_icon from '@/img/skyIcon/3-2.png';
import sky_4_icon from '@/img/skyIcon/4.png';
import sky_4_1_icon from '@/img/skyIcon/4-1.png';
import sky_4_2_icon from '@/img/skyIcon/4-2.png';
import dustIcon1 from '@/img/dustIcon/1.png';
import dustIcon2 from '@/img/dustIcon/2.png';
import dustIcon3 from '@/img/dustIcon/3.png';
import dustIcon4 from '@/img/dustIcon/4.png';

export default function ({ next, item }) {
  const navigate = useNavigate();
  const date = useStore(x => x.date);
  const data = useStore(x => x.data);
  const [nowTime, setNowTime] = useState({ type: null, time: null, day: null });
  const dayList = useRef(['일','월','화','수','목','금','토']);
  
  const autoNextPage = () => {
    let timer = item?.timer ?? item?.defaultTimer ?? 5;
    setTimeout(() => navigate(next), timer * 1000);
    console.log('현재: ' + item?.path + ', 다음: ' + next + ' (' + timer + '초 후 자동이동)');
  }

  const nowTimeFn = () => {
    let currentDate = new Date();
    let currentTime = useDate(undefined, 'time');
    let day = dayList?.current[currentDate?.getDay()] ?? '-';
    let [h, m, s] = currentTime?.split(':');
    h = Number(h);
    let type = h >= 12 ? '오후' : '오전';
    h -= h > 12 ? 12 : 0;
    h = String(h < 10 ? '0' + h : h);
    let time = h + ':' + m + ':' + s;
    setNowTime({ type, time, day });
  };

  const SKY = useMemo(() => {
    let val = data?.now;
    let result = null;
    if (val?.SKY === 1) result = sky_1_icon;
    if (val?.SKY === 3) result = sky_3_icon;
    if (val?.SKY === 3 && (val?.PTY === 1 || val?.PTY === 2 || val?.PTY === 4 || val?.PTY === 5 || val?.PTY === 6) && val?.POP >= 50) result = sky_3_1_icon;
    if (val?.SKY === 3 && (val?.PTY === 3 || val?.PTY === 7) && val?.POP >= 50) result = sky_3_2_icon;
    if (val?.SKY === 4) result = sky_4_icon;
    if (val?.SKY === 4 && (val?.PTY === 1 || val?.PTY === 2 || val?.PTY === 4 || val?.PTY === 5 || val?.PTY === 6) && val?.POP >= 50) result = sky_4_1_icon;
    if (val?.SKY === 4 && (val?.PTY === 3 || val?.PTY === 7) && val?.POP >= 50) result = sky_4_2_icon;
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

  useEffect(autoNextPage, [next, item]);
  useEffect(() => {
    nowTimeFn();
    let interval = setInterval(nowTimeFn, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className='now'>
      <h1>{item?.title ?? '-'}</h1>
      <h2>{data?.info?.LOCATION?.PATH3 ?? '-'} {date?.today} ({nowTime?.day})</h2>
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
          <span style={{ color: '#ffd543' }}>미세먼지</span>
          <span>{PM10?.img ? <img src={PM10?.img} alt={data?.now?.PM10_TEXT} /> : '-'}</span>
        </p>
        <p>
          <span style={{ color: '#ffd543' }}>초미세먼지</span>
          <span>{PM25?.img ? <img src={PM25?.img} alt={data?.now?.PM25_TEXT} /> : '-'}</span>
        </p>
      </div>
    </section>
  )
}