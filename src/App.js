import React, { useState, useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import "./App.css";
import { withNamespaces } from "react-i18next";
import i18n from "./i18n";
import { Switch, Route } from "react-router-dom";
import Auth from "./auth/auth";
import DefaultLayout from "./layouts/defaultLayout";
import { toast, ToastContainer } from "react-toastify";
import Loader from "react-loader-spinner";
import axiosInstance from "./routing/axios";
import NotFound from "./pages/notFound";
toast.configure({
  autoClose: 8000,
  draggable: false
  //etc you get the idea
});

const App = () => {
  //get loading value from redux
  const loading = useSelector(state => state.loading);
  //get language from redux
  const language = useSelector(state => state.language);

  const user = useSelector(state => state.user);
  const token = useSelector(state => state.token);
  const dispatch = useDispatch();
  //change dropdown
  // const [dropDownShow, setDropDownShow] = useState(false)
  //change website direction according to language
  const [direction, setDirection] = useState("rtl");

  //open or close language dropdown(select language) => for future when website is multilanguage
  // const openDropDown = () => {
  //     setDropDownShow(!dropDownShow)
  // }

  //set direction according to redux language
  const getDirection = () => {
    language === "per" ? setDirection("rtl") : setDirection("ltr");
  };

  const parseJwt = () => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        debugger
        return JSON.parse(jsonPayload);
    };

  const checkToken = () => {
      const parsedToken= parseJwt();
      const current_time = new Date().getTime() / 1000;
      if (current_time < parsedToken.exp) refreshToken();
  };

  const refreshToken = async () => {
        const response = await axiosInstance.post('/api/token-refresh/', {token: token});
      localStorage.setItem('highway-token', response.data.token);
      dispatch({token: response.data.token, type: 'SET_TOKEN'});

  };
    useEffect(() => {
        if(token)
        {
            const interval = setInterval(() => {
                checkToken();
            }, 500000);
            return () => clearInterval(interval);
        }
    },[]);

  //when language change direction will change and dispatch to redux i18n language will change => fort future when website is multi language
  useEffect(() => {
    i18n.changeLanguage(language);
    getDirection();
  }, [language]);




  return (
    <React.Fragment>
      <div className={`App ${direction} ${loading ? "app-loading" : ""}`}>
        <React.Suspense>
          <Switch>
            <Route
              exact
              path="/login"
              name="Login Page"
              render={props => <Auth {...props} />}
            />
            <Route
              path="/"
              name="Home"
              render={props => <DefaultLayout {...props} />}
            />
          </Switch>
        </React.Suspense>
      </div>
      <Loader
        className="loading"
        type="Circles"
        color="#6b3586 "
        height={100}
        width={100}
        timeout={20000000}
        visible={loading}
      />
    </React.Fragment>
  );
};

export default withNamespaces()(App);
