import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link,useHistory } from "react-router-dom";
import "./singleInvoice.css";
import i18next from "i18next";
import currency from "../../../filtering/currency";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import axiosInstance from "../../../routing/axios";
import { useDispatch, useSelector } from "react-redux";
library.add(faEye);

const SingleInvoice = props => {
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
  const dispatch = useDispatch();
  const token = useSelector(state => state.token);

  //show pay modal for showing details of pay and give user access to confirm
  const [showModal, setShowModal] = useState(false);
  //define total cost state the it will calculate according to all bills or selected bills
  const [totalCost, setTotalCost] = useState(0);
  //define payform state and send it to server
  //it contains description pay description, list of bills id that user want to pay and payment gateway that it's payir for default
  const [payForm, setPayForm] = useState({
    description: "",
    invoice_id: null,
    invoice_type: "invoice",
    payment_gateway: "mis"
  });

  //close modal
  const closeModal = () => {
    setTotalCost(0);
    setShowModal(false);
    setPayForm({
      ...payForm,
      description: "",
      invoice_id: null
    });
  };

  //user confirms paying and we should set data for sending to server
  const submitPayInfo = async () => {
    setShowModal(false)

    dispatch({ loading: true, type: "SHOW_LOADING" });

    try {
      const response = await axiosInstance.post("/bill/api/payment/", payForm);
      window.location.href = response.data.redirect_to;
    } catch (e) {
      console.log(e);
    }
    dispatch({ loading: false, type: "SHOW_LOADING" });
  };

  //request to download pdf
  const getPdf =async () => {
    axiosInstance.defaults.responseType = 'arraybuffer';
    const res = await axiosInstance.get(`bill/api/bill/${props.invoice.id}/export/`);
    const url = window.URL.createObjectURL(new Blob([res.data],{type: 'application/pdf'}));
    const link = document.getElementById('dwnldLnk');
    link.href = url;
    link.setAttribute('download', 'file.pdf');
    document.body.appendChild(link);
    link.click();
  };

  //show modal to display pay info and give access to user for paying
  const showPayInfo = () => {

    dispatch({ loading: true, type: "SHOW_LOADING" });
    setTotalCost(props.invoice.total_cost);
    const bills = props.invoice.id;
    setPayForm({
      ...payForm,
      invoice_id: bills
    });

    setShowModal(true);
    dispatch({ loading: false, type: "SHOW_LOADING" });
  };

  const setHeader = () => {
    if (token)
      axiosInstance.defaults.headers.common["Authorization"] = `JWT ${token}`;
  };
  useEffect(() => {
    setHeader();
  }, []);

  return (
    <React.Fragment>
      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h5>{i18next.t("payInvoices")}</h5>
        <hr />
        <span htmlFor="exampleInputPassword1">
          {`${i18next.t("payPrice")}: ${currency(totalCost)} ${i18next.t(
            "rial"
          )}`}
        </span>
        <hr />
        <p className="mt-3">{i18next.t("selectPayType")}</p>
        <div className="form-group">
          <div className="input-group mb-3">
            <div className="input-group-prepend"></div>
            <select className="custom-select" id="inputGroupSelect01">
              <option selected>{i18next.t("Choose")}</option>
              <option value="mis">{i18next.t("mis")}</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">
            {i18next.t("Description")}
          </label>
          <input
            type="text"
            className="form-control"
            value={payForm.description}
            onChange={event => {
              setPayForm({
                ...payForm,
                description: event.target.value
              });
            }}
            placeholder={i18next.t("Description")}
          />
        </div>
        <button
          type="submit"
          onClick={submitPayInfo}
          className="btn-custom pointer"
        >
          {i18next.t("pay")}
        </button>
      </Modal>
      <tr className="tr-shadow table-tr">
        <td className="table-td">
          {/*<input disabled={props.invoice.status !== 'Pending'} type="checkbox" onChange={chooseItem}/>*/}
        </td>
        <td className="table-td">{props.invoice.id}</td>
        <td className="table-td">{props.invoice.tracking_code}</td>
        <td className="table-td">
          {props.invoice.invoice_type_code === "interim"
            ? "میان‌دوره"
            : "پایان‌دوره"}
        </td>
        <td className="table-td">
          <Moment format="YYYY/MM/DD" locale="L">
            {props.invoice.created_at_jalali}
          </Moment>
        </td>
        <td className="table-td">
          {currency(props.invoice.total_cost)} {i18next.t("rial")}
        </td>
        <td className="table-td">
          <span className={props.state.color}> {props.state.text} </span>
        </td>
        <td className="table-td">
          <Moment format="YYYY/MM/DD" locale="L">
            {props.invoice.due_date_jalali}
          </Moment>
        </td>
        <td className="table-td">
          {props.invoice.status_code === "ready" && props.invoice.total_cost > 0 ? (
            <span onClick={showPayInfo} className="btn-custom pointer">
              {i18next.t('pay')}
            </span>
          ) : (
            ""
          )}
        </td>
        <td className="table-td">
          <a
            onClick={getPdf}>
            <FontAwesomeIcon className="active-icon" icon="download" />
          </a>
          <a id='dwnldLnk'/>

        </td>
        <td className="table-td">
          <Link to={`/invoices/${props.invoice.id}`}>
            <FontAwesomeIcon className="active-icon" icon="eye" />
          </Link>
        </td>
      </tr>
    </React.Fragment>
  );
};
export default SingleInvoice;
