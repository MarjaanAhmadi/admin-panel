import React, {useState, useEffect, useRef} from "react";
import { withNamespaces } from "react-i18next";
import "./invoice.css";
import SingleInvoice from "./singleInvoice/singleInvoice";
import { Table } from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../routing/axios";
import Pagination from "../../components/Pagination/pagination";
import { library } from "@fortawesome/fontawesome-svg-core";
import queryString from 'query-string';
import {Form,InputGroup} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
  faArrowUp,
  faArrowDown,
    faSearch
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import DefaultModal from "../../components/modals/defaultModal";
import InvoiceInterim from "./invoiceInterim/invoiceInterim";
import i18next from "i18next";
import SuccessPay from "../../components/successPay/successPay";

library.add(faArrowRight,faSearch, faArrowLeft, faArrowUp, faArrowDown);

const Invoice = (props ) => {
  //define dispatch to set invoices in redux
  const dispatch = useDispatch();

  const history = useHistory();
  const wrapperRef = useRef(null);

  //get invoices list from redux
  const invoices = useSelector(state => state.invoices);
  //define params for sending to server, it contains offset and limit and search word
  //default limit is 10 and offset is teh page item that selected
  const [params, setParams] = useState({
    offset: 0,
    limit: 5,
    status_code: "all",
    created_at: {
      order_by: "created_at",
      status: "arrow-down"
    },
    invoice_type_code: "all"
  });

  //define a status to understand pay status and show certain modal
  const [showPayModal, setShowPayModal] = useState(false);
  const [tracking_code, setTracking_code] = useState('');

  const [statusPay, setStatusPay] = useState('success');
  const [paymentResult, setPaymentResult] = useState({
    tracking_code: '1234545'
  });




  const [showModal, setShowModal] = useState(false);
  const [interim, setInterim] = useState({ item: {} });
  const [changeUrl, setChangeUrl] = useState({
    prev: "",
    next: ""
  });

  //get invoice count number from redux
  const count = useSelector(state => state.invoiceCount);

  //get token from local storage
  const token = localStorage.getItem("highway-token");

  //request for getting new interim invoice
  const requestForInterim = async () => {
    setShowModal(true)

    dispatch({ loading: true, type: "SHOW_LOADING" });

    try {
      const response = await axiosInstance.post("/bill/api/bill");
      setInterim({
        ...interim,
        item: response.data.data
      });
      await getAllInvoices();
    } catch (e) {
      toast.error("لطفا مجددا سعی کنید.");
    }
    dispatch({ loading: false, type: "SHOW_LOADING" });
  };

  //change page
  const getInvoicesByPageNumber = async ({ ...childData }) => {
    const currentOffset = childData.selected * 5;
    setParams({
      ...params,
      offset: currentOffset
    });
  };

  const handleChangePageByUrl = childData => {};

  const sort = () => {
    if (params.created_at.status !== "arrow-up") {
      setParams({
        ...params,
        created_at: {
          order_by: "-created_at",
          status: "arrow-up"
        }
      });
    } else {
      setParams({
        ...params,
        created_at: {
          order_by: "created_at",
          status: "arrow-down"
        }
      });
    }
  };
  const keyPress = async (e) => {
    if(e.keyCode === 13) await filterByTrackingCode();
  };

  const filterByTrackingCode = async () => {
    try{
      dispatch({ loading: true, type: "SHOW_LOADING" });
      const response = await axiosInstance.get("/bill/api/bill/", {
        params: {tracking_code: tracking_code}
      });
      setChangeUrl({
        ...changeUrl,
        next: response.data.next,
        prev: response.data.previous
      });
      dispatch({ invoices: response.data.data, type: "SET_INVOICES" });
      dispatch({
        invoiceCount: response.data.count,
        type: "SET_INVOICE_COUNT"
      });
    }
    catch (e) {
      console.log(e);
    }
    dispatch({ loading: false, type: "SHOW_LOADING" });
  };

  //render payments from server and set status for each payment
  const renderInvoices = () => {
    return invoices !== undefined && invoices.length > 0 ? (
      invoices.length > 0 ? (
        invoices.map(invoice => {
          let state = {
            text: "",
            color: ""
          };
          switch (invoice.status_code) {
            case "ready":
              state.text = "آماده پرداخت";
              state.color = "text-warning";
              break;
            case "pending":
              state.text = "در انتظار تایید";
              state.color = "text-primary";
              break;
            case "success":
              state.text = "پرداخت شده";
              state.color = "text-success";
              break;
            case "revoke":
              state.text = "منقضی شده";
              state.color = "text-secondary";
              break;
            default:
              state.text = "پرداخت نشده";
              state.color = "text-danger";
          }
          return (
            <SingleInvoice state={state} key={invoice.id} invoice={invoice} />
          );
        })
      ) : null
    ) : (
      <tr className="tr-shadow table-tr">
        <h6 className="p-4">موردی یافت نشد</h6>
      </tr>
    );
  };

  //if token is exist we should set header for axios instance
  const setHeader = () => {
    if (token)
      axiosInstance.defaults.headers.common["Authorization"] = `JWT ${token}`;
  };

  //if invoices list is empty get invoices from server
  const checkInvoices = async () => {
    if (invoices.length === 0) {
      await getAllInvoices();
    }
  };

  const getAllInvoices = async () => {
    try {
      dispatch({ loading: true, type: "SHOW_LOADING" });
      let data = {
        order_by: params.created_at.order_by,
        limit: params.limit,
        offset: params.offset
      };
      if (params.status_code !== "all")
        data["status_code"] = params.status_code;
      if (params.invoice_type_code !== "all")
        data["invoice_type_code"] = params.invoice_type_code;
      const response = await axiosInstance.get("/bill/api/bill/", {
        params: data
      });
      setChangeUrl({
        ...changeUrl,
        next: response.data.next,
        prev: response.data.previous
      });
      dispatch({ invoices: response.data.data, type: "SET_INVOICES" });
      dispatch({
        invoiceCount: response.data.count,
        type: "SET_INVOICE_COUNT"
      });
    } catch (e) {
      console.log(e);
    }
    dispatch({ loading: false, type: "SHOW_LOADING" });
  };

  const getInvoices = async () => {
    dispatch({ loading: true, type: "SHOW_LOADING" });

    try {
      const data = {
        status_code: params.status_code,
        order_by: params.created_at.order_by,
        limit: params.limit,
        offset: params.offset,
        invoice_type_code: params.invoice_type_code
      };
      const response = await axiosInstance.get("/bill/api/bill/", {
        params: data
      });

      dispatch({ invoices: response.data.data, type: "SET_INVOICES" });
      dispatch({
        invoiceCount: response.data.count,
        type: "SET_INVOICE_COUNT"
      });

      // if (page) setTimeout(() => this.$set(this.table.pagination, 'page', (page / 50) + 1), 0)
      //dispatch
    } catch (e) {
      //loading false
    }
    dispatch({ loading: false, type: "SHOW_LOADING" });
  };

  const checkPay = async () => {
    if(props.location.search !== "") {

      const values = queryString.parse(props.location.search)
      if(values.invoice_id)
        await getPaymentStatus(values.invoice_id);
    }
  };

  const getPaymentStatus =async (id) => {
    try {
      const response = await axiosInstance.get(`/bill/api/bill/${id}/`);
      setPaymentResult(response.data.data);
      setShowPayModal(true);
      if(response.data.data.status_code === 'success'){
        setStatusPay('success')
      }
      if(response.data.data.status_code === 'ready'){
        setStatusPay('failed')
      }
      if(response.data.data.status_code === 'revoke'){
        setStatusPay('revoke')
      }
    }
    catch (e) {
        history.push('/invoice')
    }
  };

  const handleClickOutside = event => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShowPayModal(false);
      if(props.location.search !== "") {

        const values = queryString.parse(props.location.search)
        if(values.invoice_id)
          history.push('/invoice');
      }
      setShowModal(false);
    }
  };

  useEffect(() => {
    checkPay();
  },[history]);


  //when component is mount Authorization header should set according to token
  useEffect(() => {
    dispatch({ loading: true, type: "SHOW_LOADING" });
    setHeader();
    checkInvoices();
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  useEffect(() => {
    params.status_code === "all" || params.invoice_type_code === "all"
      ? getAllInvoices()
      : getInvoices();
  }, [params]);
  return (
    <React.Fragment>
      <div className="p-5">
        <div ref={wrapperRef}>
          <DefaultModal
              viewComponent={''}
              open={showPayModal}
              header=" وضعیت پرداخت"
              size={"lg"}
              content={
                <React.Fragment>
                  <SuccessPay status={statusPay} item={paymentResult}/>
                  <button
                      type="submit"
                      onClick={()=>setShowPayModal(false)}
                      className="btn-custom pointer"
                  >
                    {i18next.t("exit")}
                  </button>
                </React.Fragment>
              }
          ></DefaultModal>
        </div>
        {/*<div className='row header-item'>*/}
        {/*<div className="col-lg-4">*/}
        {/*    <div className="search-items">*/}
        {/*        <input className="form-control mr-sm-2 custom-input mt-1"*/}
        {/*               type="search"*/}
        {/*               placeholder={`${i18next.t("Search")}...`}*/}
        {/*               value={params.t}*/}
        {/*               onChange={(event) => {*/}
        {/*                   setParams({*/}
        {/*                       ...params,*/}
        {/*                       t: event.target.value*/}
        {/*                   })*/}
        {/*               }}*/}
        {/*        />*/}
        {/*    </div>*/}

        {/*</div>*/}

        {/*</div>*/}
        <div className="row filter-section mt-4">
          <div className='col-md-3'>
              <Form.Group>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text onClick={filterByTrackingCode}>
                      <FontAwesomeIcon icon='search' />

                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                      onKeyDown={keyPress}
                      type="text"
                      placeholder="کد پیگیری خود را وارد نمایید"
                      value={tracking_code}
                      onChange={(event) => {
                        setTracking_code(event.target.value)
                      }}
                  />
                </InputGroup>
              </Form.Group>

          </div>
          <div className="col-md-3">
            <div className="input-group mb-3">
              <div className="input-group-prepend"></div>
              <span className="mt-2"> انتخاب وضعیت: </span>
              <select
                className="mr-2"
                onChange={event => {
                  setParams({
                    ...params,
                    status_code: event.target.value
                  });
                }}
                value={params.status_code}
                className="custom-select"
                id="inputGroupSelect01"
              >
                <option selected value="all">
                  همه
                </option>
                <option value="revoke">منقضی شده</option>
                <option value="pending">در انتظار تایید</option>
                <option value="success">پرداخت شده</option>
                <option value="ready">آماده پرداخت</option>

              </select>
            </div>
          </div>
          <div className="col-md-3">
            <div className="input-group mb-3">
              <div className="input-group-prepend"></div>
              <span className="mt-2"> انتخاب نوع صورت‌حساب: </span>
              <select
                className="mr-2"
                onChange={event => {
                  setParams({
                    ...params,
                    invoice_type_code: event.target.value
                  });
                }}
                value={params.invoice_type_code}
                className="custom-select"
                id="inputGroupSelect01"
              >
                <option selected value="all">
                  همه
                </option>
                <option value="interim">میان‌دوره</option>
                <option value="periodic"> پایان‌دوره</option>
              </select>
            </div>
          </div>
          <div ref={wrapperRef}>
            <DefaultModal
                viewComponent={
                  <span
                      onClick={requestForInterim}
                      className="btn-custom pointer inertim-btn pointer"
                  >
                {i18next.t('requestForInterim')}
              </span>
                }
                open={showModal}
                header="قبض میاندوره"
                size={"lg"}
                content={
                  <React.Fragment>
                    <InvoiceInterim interim={interim.item} />
                    <button
                        type="submit"
                        onClick={()=>setShowModal(false)}
                        className="btn-custom pointer"
                    >
                      {i18next.t("exit")}
                    </button>
                  </React.Fragment>
                }
            ></DefaultModal>
          </div>

        </div>

        <Table
          responsive
          className="table-borderless table-hover table-sep p-2"
        >
          <thead className="header-font text-secondary">
            <tr>
              <th></th>
              <th>{i18next.t("InvoiceId")}</th>
              <th>{i18next.t("tracking_code")}</th>
              <th>{i18next.t("InvoiceType")}</th>
              <th className="pointer" onClick={sort}>
                {i18next.t("CreationDate")}{" "}
                <FontAwesomeIcon icon={params.created_at.status} />
              </th>
              <th>{i18next.t("Price")}</th>
              <th>{i18next.t("Status")}</th>
              <th>{i18next.t("payTime")}</th>

              <th></th>
            </tr>
          </thead>
          <tbody className="table-body-font text-secondary">
            {renderInvoices()}
          </tbody>
        </Table>
        <Pagination
          changePageByUrl={handleChangePageByUrl}
          onChangePage={getInvoicesByPageNumber}
          count={Math.ceil(count / 5)}
        />
      </div>
    </React.Fragment>
  );
};

export default withNamespaces()(Invoice);
