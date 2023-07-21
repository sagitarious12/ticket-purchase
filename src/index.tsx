import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './Store/Store';
import { RootPage } from './Components/RootPage/RootPage';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
    <ReduxProvider store={store}>
      <React.StrictMode>
        <RootPage />
      </React.StrictMode>
    </ReduxProvider>
  </BrowserRouter>
);