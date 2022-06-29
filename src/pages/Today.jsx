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
  
  const SKY = useMemo(() => {
    let { min, max } = data?.today;
    let minResult = null;
    let maxResult = null;
    if (min?.SKY === 1) minResult = sunIcon;
    if (min?.SKY === 3) minResult = manyCloudIcon;
    if (min?.SKY === 4) minResult = cloudIcon;
    if (max?.SKY === 1) maxResult = sunIcon;
    if (max?.SKY === 3) maxResult = manyCloudIcon;
    if (max?.SKY === 4) maxResult = cloudIcon;
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

  useEffect(autoNextPage, []);

  return (
    <section className='today'>
      <h1>{item?.title ?? '-'}</h1>
      <h2>{data?.info?.LOCATION?.PATH3 ?? '-'} {date?.today}</h2>
      <div>
        <p>
          <span />
          <span>
            <span>오전</span>
            <span>오후</span>
          </span>
        </p>
        <p>
          <span>하늘상태</span>
          <span>
            {/* <span>{data?.today?.min?.SKY_TEXT ?? '-'}</span>
            <span>{data?.today?.max?.SKY_TEXT ?? '-'}</span> */}
            <span><img src={SKY?.min} alt={data?.today?.min?.SKY_TEXT} /></span>
            <span><img src={SKY?.max} alt={data?.today?.max?.SKY_TEXT} /></span>
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
          <span>강수확률</span>
          <span>
            <span>{data?.today?.min?.POP_TEXT ?? '-'}</span>
            <span>{data?.today?.max?.POP_TEXT ?? '-'}</span>
          </span>
        </p>
        <p>
          <span>미세먼지</span>
          <span>
            {/* <span>{data?.today?.min?.PM10_TEXT ?? '-'}</span>
            <span>{data?.today?.max?.PM10_TEXT ?? '-'}</span> */}
            <span><img src={PM10?.min} alt={data?.today?.min?.PM10_TEXT} /></span>
            <span><img src={PM10?.max} alt={data?.today?.max?.PM10_TEXT} /></span>
          </span>
        </p>
        <p>
          <span>초미세먼지</span>
          <span>
            {/* <span>{data?.today?.min?.PM25_TEXT ?? '-'}</span>
            <span>{data?.today?.max?.PM25_TEXT ?? '-'}</span> */}
            <span><img src={PM25?.min} alt={data?.today?.min?.PM25_TEXT} /></span>
            <span><img src={PM25?.max} alt={data?.today?.max?.PM25_TEXT} /></span>
          </span>
        </p>
      </div>
    </section>
  )
}