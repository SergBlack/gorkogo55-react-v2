import React, { useState, useEffect } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import Tabletop from "tabletop";
import ym from "react-yandex-metrika";
import { YMInitializer } from "react-yandex-metrika";

import MainPage from "./containers/MainPage/MainPage";
import SearchPage from "./containers/SearchPage/SearchPage";
import ShopPage from "./containers/ShopPage/ShopPage";
import testData from "./data/shops.json";

import classes from "./App.module.css";

const SPREAD_SHEET_KEY = "1rg0Wkb4E1MccFnNJcasmn4uUwxNXDOs_ObeOC9MyYiM";

const App = props => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setLoading(true);
    Tabletop.init({
      key: SPREAD_SHEET_KEY,
      callback: googleData => setDataFromGS(googleData),
      simpleSheet: true
    });
  }, []);

  const setDataFromGS = sheets => {
    setLoading(false);
    setData(sheets.length === 0 ? testData : sheets);
  };

  const changeSearchGroup = searchValue => {
    setSearchValue(searchValue);
    props.history.push(`/search`);
  };

  const changeSearchValue = event => {
    setSearchValue(event.target.value);
    ym(54289579, "reachGoal", "useInput");
  };

  const clearSearchValue = () => {
    setSearchValue("");
  };

  return (
    <div className={classes.App}>
      <main>
        <Switch>
          <Route
            path="/"
            exact={true}
            render={routeProps => (
              <MainPage
                {...routeProps}
                isLoadingData={isLoading}
                searchValue={searchValue}
                clearSearchValue={clearSearchValue}
                changeSearchCategory={changeSearchGroup}
              />
            )}
          />
          <Route
            path="/search"
            render={routeProps => (
              <SearchPage
                {...routeProps}
                hashTageSearch={changeSearchGroup}
                isLoadingData={isLoading}
                changeSearchValue={changeSearchValue}
                data={data}
                searchValue={searchValue}
              />
            )}
          />
          <Route
            path="/shop/:id"
            render={routeProps => (
              <ShopPage
                {...routeProps}
                hashTageSearch={changeSearchGroup}
                data={data}
                isLoadingData={isLoading}
              />
            )}
          />
        </Switch>
      </main>
      <footer>
        {/* Yandex.Metrika informer */}
        <section className={[classes.Black, classes.BoxShadow].join(" ")}>
          <a
            href="https://metrika.yandex.ru/stat/?id=53046907&amp;from=informer"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://informer.yandex.ru/informer/53046907/3_1_FFFFFFFF_FFFFFFFF_0_pageviews"
              style={{
                width: "88px",
                height: "31px",
                border: 0
              }}
              alt="Яндекс.Метрика"
              title="Яндекс.Метрика: данные за сегодня (просмотры, визиты и уникальные посетители)"
              className="ym-advanced-informer"
              data-cid="53046907"
              data-lang="ru"
            />
          </a>
        </section>
        {/* /Yandex.Metrika informer */}
      </footer>
      <YMInitializer accounts={[53046907]} />
    </div>
  );
};

export default withRouter(App);
