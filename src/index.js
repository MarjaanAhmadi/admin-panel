import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import store from "./redux/store";
import "./index.css";
import "./i18n";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "bootstrap-v4-rtl/dist/css/bootstrap-rtl.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "animate.css/animate.min.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "react-modern-calendar-datepicker/lib/DatePicker.css";


ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
