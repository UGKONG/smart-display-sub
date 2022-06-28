import React from 'react';
import Styled from 'styled-components';
import axios from 'axios';

const Header = () => {
  const exit = () => axios.post('/closeApp');

  return (
    <>
      <Movebutton>🤚</Movebutton>
      <Xbutton id='close' onClick={exit}>
        <div><span /><span /></div>
      </Xbutton>
    </>
  );
}
export default Header;

const Xbutton = Styled.button`
  position: fixed;
  width: 20px;
  height: 20px;
  right: 5px;
  top: 5px;
  border-radius: 4px;
  background-color: #f54e4e;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  z-index: 99;
  /* &:hover {
    opacity: 1;
  } */
  
  & > div {
    position: relative;
    width: 100%;
    height: 100%;
    & > span {
      position: absolute;
      left: 50%;
      top: 50%;
      background-color: #fff;
      width: 70%;
      height: 2px;
      &:first-of-type {
        transform: translate(-50%, -50%) rotate(45deg);
      }
      &:last-of-type {
        transform: translate(-50%, -50%) rotate(-45deg);
      }
    }
  }
`;
const Movebutton = Styled.button`
  cursor: move;
  position: fixed;
  width: calc(100% - 35px);
  height: 20px;
  right: 30px;
  top: 5px;
  background-color: #ffffff10;
  border: none;
  border-radius: 4px;
  -webkit-app-region: drag;
  opacity: 0;
`;