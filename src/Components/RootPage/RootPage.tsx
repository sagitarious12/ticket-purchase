import React, { PropsWithChildren } from 'react';
import './RootPage.scss';
import { Route, Routes, useNavigate } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { App } from '../../Pages/Home/App';
import { Checkout } from '../../Pages/Checkout/Checkout';
import { useDispatch } from 'react-redux';
import { ConcertActions } from '../../Store/reducers/concerts';

export const RootPage = (props: PropsWithChildren<{}>) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="RootPageWrapper">
      <div className="WebsiteTitle">
        <h1 style={{cursor: 'pointer'}} onClick={() => {
          dispatch(ConcertActions.deselectConcert())
          navigate('/');
        }}>Stub Master</h1>
      </div>
      <div className="mainContent">
        <div className="paddedContent">
          <Routes>
            <Route Component={App} path="/" />
            <Route Component={Checkout} path="/checkout/:id" />
          </Routes>
        </div>
      </div>
    </div>
  )
}