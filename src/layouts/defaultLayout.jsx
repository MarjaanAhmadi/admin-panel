import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import routes from "../routing/routes";
import Header from "./header/header";
import Sidebar from "./sidebar/sidebar";
import "./defaultLayout.css";

const DefaultLayout = () => {
  const showNav = useSelector(state => state.showNav);
  const loading = () => {
  };

  return (
    <React.Fragment>
      <Sidebar />

      <div id="main" className={showNav ? "main-margin" : "sub-margin"}>
        <Header />
        <React.Suspense fallback={loading}>
          <Switch>
            {routes.map((route, idx) => {
              return route.component ? (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  render={props => <route.component {...props} />}
                />
              ) : null;
            })}
            {
              localStorage.getItem('highway-token') ? <Redirect from="/" to="/invoice" /> : <Redirect from="/" to="/login" />
            }
          </Switch>
        </React.Suspense>
      </div>
    </React.Fragment>
  );
};
export default DefaultLayout;
