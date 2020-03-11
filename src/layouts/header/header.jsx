import React, {useEffect, useRef, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown } from "react-bootstrap";
import { withNamespaces } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import ResetPassword from "../../auth/resetPassword/resetPassword";
import "./header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import { faLockOpen, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../routing/axios";
import Modal from "react-modal";
import i18next from "i18next";
library.add(faLockOpen, faSignOutAlt);

const Header = ({ t }) => {

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      fontFamily: "iransans",
      textAlign: "right"
    }
  };


  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const history = useHistory();
  const token = useSelector(state => state.token);
  const wrapperRef= useRef(null);

  const [showModal, setShowModal] = useState(false)

  const logout = () => {
    localStorage.removeItem("highway-token");
    const token = "";
    const user = null;
    dispatch({ token, type: "SET_TOKEN" });
    dispatch({ user, type: "SET_USER" });
    history.push("/login");
  };
  const getUserData = async () => {
    try {

      const response = await axiosInstance.get("/users/api/user/current/");
      const user = `${response.data.data.first_name} ${response.data.data.last_name}`;
      // dispatch user to redux
      dispatch({ user, type: "SET_USER" });
    } catch (e) {
      console.log(e);
    }
  };
  const setHeader = () => {

    axiosInstance.defaults.headers.common['Authorization'] = `JWT ${token}`
  }
  const handleClickOutside = event => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShowModal(false);
    }
  };
  useEffect(() => {
    setHeader();
    getUserData();
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  },[])
  return (
    <div className="shadow p-3 mb-5 bg-white rounded header-height">
      <div className="header-item">
        <h3 className="mr-3">{t("PanelManagement")}</h3>

        <Dropdown>
          <Dropdown.Toggle className="header-dropdown-btn">
            {user !== "" ? user : ""}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
                onClick={()=>{setShowModal(true)}}
                eventKey="1"
                className="text-secondary header-dropdown-item pointer"
            >
              <FontAwesomeIcon icon="lock-open"/> تغییر رمز عبور{" "}
            </Dropdown.Item>
            <Modal
                isOpen={showModal}
                onRequestClose={()=>setShowModal(false)}
                style={customStyles}
                contentLabel="Example Modal"
            >
              <h5>{i18next.t("تغییر رمز عبور")}</h5>
              <hr />
              <ResetPassword closeModal={() => setShowModal(false)}/>
            </Modal>
            <Dropdown.Divider />
            <Dropdown.Item
              onClick={logout}
              eventKey="2"
              className="text-secondary header-dropdown-item pointer"
            >
              <FontAwesomeIcon icon="sign-out-alt" /> خروج{" "}
            </Dropdown.Item>

          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};
export default withNamespaces()(Header);
