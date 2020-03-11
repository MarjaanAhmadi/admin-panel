import React, { useState, useEffect } from "react";
import Login from "./login/login";
import ForgetPassword from "./forgetPassword/forgetPassword";
import { withNamespaces } from "react-i18next";
import "./auth.css";

//this component contains login and forget password components
//when user click on forget password => then forget password component will render
//else or user clicks on login => then login component will render
const Auth = ({ t }) => {
  const [showStatus, setShowStatus] = useState({
    status: false,
    titleText: "LoginToPanel"
  });

  const handleLanguage = childData => {
    !childData
      ? setShowStatus({
          ...showStatus,
          status: false,
          titleText: "LoginToPanel"
        })
      : setShowStatus({
          ...showStatus,
          status: true,
          titleText: "RecoveryPassword"
        });
  };

  const renderAuthComponent = () => {
    return showStatus.status === false ? (
      <Login status={showStatus.status} onSelectLanguage={handleLanguage} />
    ) : (
      <ForgetPassword onSelectLanguage={handleLanguage} />
    );
  };
  useEffect(() => {
    renderAuthComponent();
  }, [showStatus]);

  return (
    <div className="login-container">
      <div className="card shadow-lg w-25 login-center">
        <div className="card-body card-items">
          <div className="animated fadeInDownBig faster card-items">
            <img
              className="login-logo"
              src="https://tr1.nexfon.ir/img/LogoIndex.ff65f7d6.svg"
              alt="NexFon"
            />
            <h5 className="text-center p-1">{t(showStatus.titleText)}</h5>
          </div>

          {renderAuthComponent()}
        </div>
      </div>
    </div>
  );
};
export default withNamespaces()(Auth);
