import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Routes, Route, useLocation } from 'react-router-dom';
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
import LogoPage from "./pages/Logo";

import morning from './img/skyBg/morning.jpg';
import afternoon from './img/skyBg/afternoon.jpg';
import evening from './img/skyBg/evening.jpg';
import night from './img/skyBg/night.jpg';

const App = () => {
  const location = useLocation();
  const dispatch = useStore(x => x.setState);
  const data = useStore(x => x?.data);
  const bgList = useRef([ morning, afternoon, evening, night ]);
  const bdList = useRef([ '#a0746b', '#016d94', '#ce9bac', '#16306d', '#2359c4', '#00b16b', '#ffd543', '#da3539', 'transparent' ]);
  const [activeBgIdx, setActiveBgIdx] = useState(null);
  const [pageList, setPageList] = useState([]);
  const [screenType, setScreenType] = useState(null);
  const [pageType, setPageType] = useState(null);
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
    { id: 10, component: LogoPage },
  ]);

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
    let pageId = Number(location?.pathname?.replaceAll('/', ''));

    useAxios.get('/getData?id=' + conf.id).then(({ data }) => {
      dispatch('data', data);

      let _pageList = data?.info?.PAGE;

      if (_pageList) {
        // 페이지 필터
        let find = _pageList?.find(x => x?.ID === pageId);
        let thisScreenId = find?.SCREEN_ID;
        _pageList = _pageList?.filter(x => x?.SCREEN_ID === thisScreenId);

        // 스크린, 페이지 타입
        let scr = thisScreenId === 1 ? 1 : 2;
        let type = find?.TYPE;
        setScreenType(scr);
        setPageType(type);
        
        // 데이터 가공
        _pageList = _pageList.map(item => ({
          id: item?.ID,
          screenId: item?.SCREEN_ID,
          pageId: item?.PAGE_ID,
          path: '/' + item?.ID, 
          title: item?.PAGE_TITLE, 
          timer: item?.TIMER,
          order: item?.ORDER,
          type: item?.TYPE,
          defaultTimer: item?.DEFAULT_TIMER,
          mediaURL: item?.MEDIA_URL,
          element: components?.current?.find(x => x.id === item?.PAGE_ID)?.component ?? Now
        }));
        
        // 가공된 페이지 리스트
        setPageList(_pageList);
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
  }, []);

  // 다음 페이지 알아내기
  const nextPage = useCallback((all, now) => {
    let result = (now < all.length - 1) ? now + 1 : 0;
    return '/' + all[result]?.id;
  }, []);

  // 배경 로직
  const autoBgIdxFn = useCallback(() => {
    let now = (new Date()).getTime();
    let result = 0;

    axios.get(conf.requestURL + '/api/getSetting/' + conf.id).then(({ data }) => {
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
  }, []);

  // 보더 로직
  const autoBdIdxFn = useCallback(() => {
    let result = 4;
    let pathName = Number(location?.pathname?.replaceAll('/', ''));
    let find = pageList?.find(x => x?.id === pathName);
    let pageId = find?.pageId;
    if (pageId === 10) return setActiveBgIdx(8);
  
    let val = data?.now[pageId === 6 ? 'PM10_TEXT' : 'PM25_TEXT'];
    if (val === '좋음') result = 4;
    if (val === '보통') result = 5;
    if (val === '나쁨') result = 6;
    if (val === '매우나쁨') result = 7;
    setActiveBgIdx(result);
  
  }, [location, data, pageList, pageType, setPageType, activeBgIdx, setActiveBgIdx]);

  // 페이지 변경 시 실행 함수
  const pageChangeFn = useCallback(() => {
    if (!screenType) return;
    (screenType === 1 ? autoBgIdxFn : autoBdIdxFn)();
  }, [screenType, autoBgIdxFn, autoBdIdxFn]);

  // 시작 함수
  const startFn = useCallback(() => {
    getDate();
    getData();
    setInterval(getDate, 1000 * 60 * conf.timeSet.date);
    setInterval(getData, 1000 * 60 * conf.timeSet.data);
  }, [getDate, getData, pageChangeFn]);

  // 함수 시작
  useEffect(() => startFn(), []);
  useEffect(() => pageChangeFn(), [pageList, screenType, location, data]);
  // useEffect(() => console.log(bdList?.current[activeBgIdx]), [activeBgIdx]);
  

  // JSX
  if (!data) return <UpdateMain>업데이트중..</UpdateMain>;

  return (
    <Main bg={bgList?.current[activeBgIdx] ?? null} bd={bdList?.current[activeBgIdx] ?? null}>
      <Header />
      <Routes>
        {pageList && pageList?.map((item, i) => (
          <Route path={'/' + item.id} key={i} element={
            <item.element next={nextPage(pageList, i)} item={item} />
          }/>
        ))}
        <Route path={'/dev'} element={ <Dev /> } />
      </Routes>
    </Main>
  )
}

export default App;

const Main = Styled.main`
  background-image: url(${x => x?.bg});
  border: ${x => x?.bd !== 'transparent' ? ('3px solid ' + x?.bd) : 'none'};
`;
const UpdateMain = Styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #333;
  color: #fff;
  font-size: 10vw;
`;