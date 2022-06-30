import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Routes, Route } from 'react-router-dom';
import Styled from 'styled-components';
import axios from "axios";
import useAxios from "%/useAxios";
import useDate from '%/useDate';
import useStore from '%/useStore';
import conf from '../config.json';

import Logo from "./pages/Logo";
import Header from "./Header";
import Now from './pages/Now';
import Today from './pages/Today';
import Tomorrow from './pages/Tomorrow';
import Week from './pages/Week';
import Text from './pages/Text';
import Dust from './pages/Dust';
import DetailDust from './pages/DetailDust';
import Image from './pages/Image';
import Video from './pages/Video';
import Dev from "./pages/Dev";

import morning from './img/skyBg/morning.jpg';
import afternoon from './img/skyBg/afternoon.jpg';
import evening from './img/skyBg/evening.jpg';
import night from './img/skyBg/night.jpg';

const App = () => {
  const dispatch = useStore(x => x.setState);
  const data = useStore(x => x?.data);
  const components = useRef([
    { id: 1, component: Now },
    { id: 2, component: Today },
    { id: 3, component: Tomorrow },
    { id: 4, component: Week },
    { id: 5, component: Text },
    { id: 6, component: Dust },
    { id: 7, component: DetailDust },
    { id: 8, component: Image },
    { id: 9, component: Video },
  ]);
  const bgList = [ morning, afternoon, evening, night ];
  const [activeBgIdx, setActiveBgIdx] = useState(0);
  // 양식 : { path: '/now', title: '현재상태', element: Now }
  const [scrPage, setScrPage] = useState([]);

  // 날짜 정보 GET
  const getDate = useCallback(() => {
    let date = new Date();
    let today = useDate(date, 'dateMD');
    date.setDate(date.getDate() + 1);
    let tomorrow = useDate(date, 'dateMD');
    let result = { today, tomorrow };
    dispatch('date', result);
  }, []);
  // 날씨 정보 GET
  const getData = useCallback(() => {
    useAxios.get('/getData?id=' + conf.id).then(({ data }) => {
      dispatch('data', data);
      let pageList = data?.info?.PAGE;
      let distinctScreen = [];

      if (pageList) {
        // 스크린 중복확인
        pageList.forEach(item => {
          let isNone = distinctScreen?.indexOf(item.SCREEN_ID) === -1;
          isNone && distinctScreen?.push(item.SCREEN_ID);
        });
        
        // 데이터 가공
        pageList = pageList.map(item => {
          return { 
            id: item?.PAGE_ID,
            screenId: item?.SCREEN_ID,
            path: '/' + item?.PAGE_NAME?.toLowerCase(), 
            title: item?.PAGE_TITLE, 
            timer: item?.TIMER,
            order: item?.ORDER,
            defaultTimer: item?.DEFAULT_TIMER,
            mediaURL: item?.MEDIA_URL,
            element: components?.current?.find(x => x.id === item?.PAGE_ID)?.component ?? Now
          }
        });

        // 스크린 별로 페이지 분리
        let tempArr = [];
        distinctScreen.forEach(item => {
          let filter = pageList.filter(x => x?.screenId === item);
          tempArr.push(filter);
        });
        setScrPage(tempArr);
      }

      // 아두이노
      if (data?.now) {
        let dustData = data.now.PM10;
        let result = false;
        if (dustData <= 80) result = true;
        if (81 <= dustData) result = false;
        axios.put(result ? '/serialPortOn' : '/serialPortOff');
      }
    });
  }, [setScrPage]);
  // 다음 페이지 알아내기
  const nextPage = (all, now) => {
    let result = (now < all.length - 1) ? now + 1 : 0;
    return all[result]?.path ?? '/now';
  };
  // 자동 배경 변경 함수
  const autoBgFn = () => {
    let now = (new Date()).getTime();
    let result = 0;

    axios.get(conf.requestURL + '/api/getSetting/' + conf.id).then(({ data }) => {
      console.log(data);
      let today = useDate(undefined, 'date');
      let time1 = new Date(`${today} ${data?.BG1_TIME}:00`)?.getTime();
      let time2 = new Date(`${today} ${data?.BG2_TIME}:00`)?.getTime();
      let time3 = new Date(`${today} ${data?.BG3_TIME}:00`)?.getTime();
      let time4 = new Date(`${today} ${data?.BG4_TIME}:00`)?.getTime();
      
      if (now >= time1) result = 0;
      if (now >= time2) result = 1;
      if (now >= time3) result = 2;
      if (now >= time4) result = 3;
      setActiveBgIdx(result);
    });
  }
  // 시작 함수
  const startFn = () => {
    getDate();
    getData();
    setInterval(getDate, 1000 * 60 * conf.timeSet.date);
    setInterval(getData, 1000 * 60 * conf.timeSet.data);
    setInterval(autoBgFn, 10000);
  }

  // 함수 시작
  useEffect(() => startFn(), []);

  if (!data) return <UpdateMain>업데이트중..</UpdateMain>;

  return (
    <Main bg={bgList[activeBgIdx]}>
      <Header />
      <Routes>
        {/* 스크린 1 */}
        {scrPage[0] && scrPage[0].map((item, i) => (
          <Route path={item.path} key={i} element={
            <item.element next={nextPage(scrPage[0], i)} item={item} />
          }/>
        ))}

        {/* 스크린 2 */}
        {scrPage[1] && scrPage[1].map((item, i) => (
          <Route path={item.path} key={i} element={
            <item.element next={nextPage(scrPage[1], i)} item={item} />
          }/>
        ))}

        {/* 예비용 */}
        {scrPage[2] && scrPage[2].map((item, i) => (
          <Route path={item.path} key={i} element={
            <item.element next={nextPage(scrPage[2], i)} item={item} />
          }/>
        ))}

        {/* 예비용 */}
        {scrPage[3] && scrPage[3].map((item, i) => (
          <Route path={item.path} key={i} element={
            <item.element next={nextPage(scrPage[3], i)} item={item} />
          }/>
        ))}

        {/* 예비용 */}
        {scrPage[4] && scrPage[4].map((item, i) => (
          <Route path={item.path} key={i} element={
            <item.element next={nextPage(scrPage[4], i)} item={item} />
          }/>
        ))}

        <Route path={'/logo'} element={ <Logo /> } />
        <Route path={'/dev'} element={ <Dev /> } />

      </Routes>
    </Main>
  )
}

export default App;

const Main = Styled.main`
  background-image: url(${x => x?.bg});
  background-color: #333;
`;
const UpdateMain = Styled.main`
  display: flex;
  align-items: center;
  justifyContent: center;
  background-color: #333;
  color: #fff;
  font-size: 10vw;
`;