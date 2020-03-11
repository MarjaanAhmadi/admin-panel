import React, { useState } from "react";
import i18next from "i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withNamespaces } from "react-i18next";
import { library } from "@fortawesome/fontawesome-svg-core";
import axiosInstance from "../../routing/axios";
import { toast } from "react-toastify";

import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
library.add(faUser, faLock);

const ForgetPassword = props => {
  //deine forget password state for getting username or email
  const [forgetPassword, setForgetPassword] = useState({ usernameOrEmail: "" });

  //define user name validation
  const [validateUsername, setValidateUsername] = useState({
    username: false
  });

  //render forget password or login component
  const setData = event => {
    props.onSelectLanguage(false);
  };

  //check user name or email isn't empty
  const checkValidation = () => {
    if (forgetPassword.usernameOrEmail === "")
      setValidateUsername({
        ...validateUsername,
        username: true
      });
  };
  //send user name or email to server for getting password
  const sendForgetPasswordData = async () => {
    try {
      const response = await axiosInstance.get(
        "/users/api/user/recover_password/",
        { params: { key: forgetPassword.usernameOrEmail } }
      );
      toast.success(
        `لینک بازیابی رمز عبور به ایمیل ${response.data.data.email} ارسال شد`
      );
    } catch (e) {
      console.log(e);
      toast.error("نام کاربری یا ایمیل اشتباه است!");
    }
  };

  //if tehere isnt any error forget password data will call to send api to server
  const forgetPasswordFunc = async () => {
    checkValidation();
    if (forgetPassword.usernameOrEmail !== "") await sendForgetPasswordData();
  };

  return (
    <React.Fragment>
      <div className="animated fadeInLeftBig faster">
        <div className="form-group">
          <label className="sr-only" htmlFor="inlineFormInputGroupUsername2">
            {i18next.t("UsernameOrEmail")}
          </label>
          <div className="input-group mb-2 mr-sm-2 p-2 login-input">
            <input
              type="text"
              className="form-control custom-input"
              value={forgetPassword.usernameOrEmail}
              onChange={event =>
                setForgetPassword({
                  ...forgetPassword,
                  usernameOrEmail: event.target.value
                })
              }
              placeholder={i18next.t("UsernameOrEmail")}
              onFocus={()=>{
                setValidateUsername({
                  ...validateUsername,
                  username: false
                })
              }}
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
        <div className="text-center mt-3">
          <div
            className="shadow-lg btn-custom bg-success w-50 pointer"
            onClick={forgetPasswordFunc}
          >
            {i18next.t("Recovery")}
          </div>
          <br />
          <div className="mt-3">
            <a onClick={setData} className="card-link forgot-login pointer">
              {i18next.t("LoginToPanel")}
            </a>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default withNamespaces()(ForgetPassword);
