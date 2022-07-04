import React, { useCallback, useEffect, useMemo, useRef } from 'react';
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

export default function ({ next, item }) {
  const navigate = useNavigate();
  const data = useStore(x => x.data);
  const dayList = useRef(['일', '월', '화', '수', '목', '금', '토']);
  
  const autoNextPage = () => {
    let timer = item?.timer ?? item?.defaultTimer ?? 5;
    setTimeout(() => navigate(next), timer * 1000);
    console.log('현재: ' + item?.path + ', 다음: ' + next + ' (' + timer + '초 후 자동이동)');
  }

  const dateRange = useMemo(() => {
    let week = data?.week ?? [];
    if (week?.length === 0) return '';
    let start = week[0]?.DATE?.slice(5)?.replaceAll('-', '/');
    let end = week[week?.length - 1]?.DATE?.slice(5)?.replaceAll('-', '/');
    let result = '(' + start + '~' + end + ')';
    return result;
  }, [data?.week]);

  const dateToDay = useCallback(dt => {
    if (!dt) return '-';
    let date = new Date(dt);
    let day = date?.getDay();
    return dayList?.current[day];
  })
  
  const SKY = useCallback(val => {
    let result = null;
    if (val?.SKY === 1) result = sky_1_icon;
    if (val?.SKY === 3) result = sky_3_icon;
    if (val?.SKY === 3 && (val?.PTY === 1 || val?.PTY === 2 || val?.PTY === 4 || val?.PTY === 5 || val?.PTY === 6) && val?.RAIN >= 50) result = sky_3_1_icon;
    if (val?.SKY === 3 && (val?.PTY === 3 || val?.PTY === 7) && val?.RAIN >= 50) result = sky_3_2_icon;
    if (val?.SKY === 4) result = sky_4_icon;
    if (val?.SKY === 4 && (val?.PTY === 1 || val?.PTY === 2 || val?.PTY === 4 || val?.PTY === 5 || val?.PTY === 6) && val?.RAIN >= 50) result = sky_4_1_icon;
    if (val?.SKY === 4 && (val?.PTY === 3 || val?.PTY === 7) && val?.RAIN >= 50) result = sky_4_2_icon;
    return result;
  }, [data?.week]);

  useEffect(autoNextPage, [next, item]);

  return (
    <section className='week'>
      <h1>{item?.title ?? '-'}</h1>
      <h2>{data?.info?.LOCATION?.PATH3 ?? '-'} {dateRange}</h2>
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
            <span>{SKY(item) ? <img style={iconStyle} src={SKY(item)} alt={item?.SKY_TEXT} /> : '-'}</span>
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