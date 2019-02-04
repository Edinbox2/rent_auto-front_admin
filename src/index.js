import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import Routes from "./routes";
import "./app.css";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "react-router-redux";
import rootReducer from "./store/reducers";

import {IntlProvider, addLocaleData} from 'react-intl';
import locale_en from 'react-intl/locale-data/en';
import locale_ru from 'react-intl/locale-data/ru';
import messages_ru from './components/translations/ru.json';
import messages_en from './components/translations/en.json';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const history = createBrowserHistory();

addLocaleData([...locale_en, ...locale_ru]);
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(routerMiddleware(history), thunk))
);

const messages = {
  'ru': messages_ru, 
  'en': messages_en
};
const language = navigator.language.split(/[-_]/)[0];

const app = (
  <IntlProvider locale={language} messages={messages[language]}>
    <Provider store={store}>
      <Router history={history}>
        <Routes />
      </Router>
    </Provider>
  </IntlProvider>
);

ReactDOM.render(app, document.getElementById("root"));
