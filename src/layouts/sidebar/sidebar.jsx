import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import routes from "../../routing/routes";
import { withNamespaces } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import "./sidebar.css";
import { library } from "@fortawesome/fontawesome-svg-core";

import {
  faFile,
  faCreditCard,
  faDownload,
  faList,
  faUser
} from "@fortawesome/free-solid-svg-icons";
library.add(faFile, faCreditCard, faDownload, faList, faUser);

const Sidebar = ({ t }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const showNav = useSelector(state => state.showNav);

  const showSidebar = () => {
    dispatch({ showNav, type: "SET_SHOWNAV" });
  };
  const renderRoutes = () => {
    return routes.map(route => {
      return !route.meta.child ? (
        <React.Fragment key={route.path}>
          <Link to={route.path}>
            <span
              className={`icon-color ${
                history.location.pathname === route.path ? "active-icon" : ""
              }`}
            >
              {showNav ? (
                <span>
                  <span>{t(route.name)}</span>
                </span>
              ) : (
                ""
              )}
            </span>
          </Link>
          <hr />
        </React.Fragment>
      ) : null;
    });
  };
  return (
    <div
      id="mySidebar"
      className={`sidebar shadow bg-white rounded ${
        showNav ? "show-width" : ""
      }`}
    >
      <button className="openbtn pointer" onClick={showSidebar}>
        <FontAwesomeIcon className="toggle-icon" icon="list" />
      </button>
      <hr />
      {renderRoutes()}
    </div>
  );
};
export default withNamespaces()(Sidebar);
