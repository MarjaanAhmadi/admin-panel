import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import i18next from "i18next";
import { toast } from "react-toastify";
import "./login.css";
import { withNamespaces } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../routing/axios";
library.add(faUser, faLock);

const Login = props => {
  const dispatch = useDispatch();

  let history = useHistory();

  //define validation state for username
  const [validateUsername, setValidationUsername] = useState({
    username: false
  });

  //define validation state for password
  const [validatePassword, setValidationPassword] = useState({
    password: false
  });

  //define login data state that should send to server to login
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    is_staff: false
  });

  //check username and password aren't empty
  const checkValidation = () => {
    if (loginData.username === "") {
      setValidationUsername({
        ...validateUsername,
        username: true
      });
    }
    if (loginData.password === "") {
      setValidationPassword({
        ...validatePassword,
        password: true
      });
    }
  }; const keyPress = async (e) => {
    if(e.keyCode === 13) await loginForm();
  }
  //after login user a request will get user data according to header token
  // const getUserData = async () => {
  //   try {
  //     const response = await axiosInstance.get("/users/api/user/current/");
  //     const user = `${response.data.data.first_name} ${response.data.data.last_name}`;
  //     // dispatch user to redux
  //     dispatch({ user, type: "SET_USER" });
  //   } catch (e) {
  //
  //     console.log(e);
  //     localStorage.removeItem("highway-token");
  //
  //     const token = "";
  //     dispatch({ token, type: "SET_TOKEN" });
  //   }
  // };

  //send login data to server to get auth token and login user
  const sendLoginData = async () => {
    debugger
    try {
      const response = await axiosInstance.post("/users/api/token-auth/", {
        username: loginData.username,
        password: loginData.password,
        is_staff: false
      });
      //set token in local storage and redux
      const token = response.data.data.token;
      axiosInstance.defaults.headers.common["Authorization"] = `JWT ${token}`;

      localStorage.setItem("highway-token", token);
      dispatch({ token, type: "SET_TOKEN" });
          history.push("/invoice");

    } catch (e) {
      toast.error("نام کاربری یا رمز عبور اشتباه است!");
      console.log(e);
    }
  };

  //after clicking on login inputs validation will call and if there isn't any error data will send to server using send loginddata()
  const loginForm = async () => {
    dispatch({ loading: true, type: "SHOW_LOADING" });
    checkValidation();
    if (loginData.username !== "" && loginData.password !== "")
      await sendLoginData();
    dispatch({ loading: false, type: "SHOW_LOADING" });
  };
  //login or forget password component should render
  const setData = () => {
    props.onSelectLanguage(true);
  };
  return (
    <React.Fragment>
      <div className="animated fadeInLeftBig faster">
        <div className="form-group ">
          <label className="sr-only" htmlFor="inlineFormInputGroupUsername2">
            {i18next.t("Username")}
          </label>
          <div className="input-group mb-2 mr-sm-2 p-2 login-input">
            <input
              type="text"
              className="form-control custom-input"
              value={loginData.username}
              onChange={event => {
                setLoginData({
                  ...loginData,
                  username: event.target.value
                });
              }}
              onKeyDown={keyPress}
              onFocus={() => setValidationUsername({
                ...validateUsername,
                username: false
              })}
              placeholder={i18next.t("Username")}
            />
            <div className="input-group-prepend">
              <div className="input-group-text login-icon">
                <FontAwesomeIcon icon="user" />
              </div>
            </div>
          </div>
          {validateUsername.username ? (
            <span className="text-danger error">
              {i18next.t("requiredField")}
            </span>
          ) : (
            ""
          )}
        </div>
        <div className="form-group">
          <label className="sr-only" htmlFor="inlineFormInputGroupUsername2">
            {i18next.t("Password")}
          </label>
          <div className="input-group mb-2 mr-sm-2 p-2 login-input">
            <input
              type="password"
              value={loginData.password}
              onChange={event => {
                setLoginData({
                  ...loginData,
                  password: event.target.value
                });
              }}
              onKeyDown={keyPress}
              onFocus={() => setValidationPassword({
                ...validatePassword,
                password: false
              })}
              className="form-control custom-input"
              id="inlineFormInputGroupUsername2"
              placeholder={i18next.t("Password")}
            />
            <div className="input-group-prepend ">
              <div className="input-group-text login-icon">
                <FontAwesomeIcon icon="lock" />
              </div>
            </div>
          </div>
          {validatePassword.password ? (
            <span className="text-danger error">
              {i18next.t("requiredField")}
            </span>
          ) : (
            ""
          )}
        </div>
        <div className="text-center mt-3">
          <div
            className="shadow-lg btn-custom bg-success w-50 pointer"
            onClick={loginForm}
          >
            {i18next.t("Login")}
          </div>
          <br />
          <div className="mt-3">
            <span onClick={setData} className="card-link forgot-login pointer">
              {i18next.t("ForgetPassword")}
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default withNamespaces()(Login);
