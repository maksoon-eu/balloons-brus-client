import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from "react-router-dom";
import App from './components/app/App';

import ItemStore from './store/ItemStore';
import UserStore from './store/UserStore';
import WorkStore from './store/WorkStore';
import ReviewStore from './store/ReviewStore';
import SliderStore from './store/SliderStore';

import './style/style.scss';

export const Context = createContext(null);

const Root = () => <Router><App /></Router>;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
    <Context.Provider value={{
      user: new UserStore(),
      items: new ItemStore(),
      works: new WorkStore(),
      reviews: new ReviewStore(),
      sliders: new SliderStore(),
    }}>
      <Root/>
    </Context.Provider>
    // </React.StrictMode>
);
