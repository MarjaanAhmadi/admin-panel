import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import i18next from "i18next";
import axiosInstance from "../../../routing/axios";
import {toast} from "react-toastify";
import SinglePayment from "../../credit/singlePayment/singlePayment";
import {Table} from "react-bootstrap";
import Moment from "react-moment";

const BaseBalanceInvoiceItem = props => {
  const [invoice, setInvoice] = useState({});
  const [payments, setPayments] = useState({list: []})
  const token = useSelector(state => state.token);
  const dispatch = useDispatch();

  //should send api to server
  const getSpecificInvoice = async () => {
    dispatch({ loading: true, type: "SHOW_LOADING" });
    try {
      const response = await axiosInstance.get(
        `/bill/api/base-balance-bill/${props.match.params.id}`
      );
      let invoiceSpec = response.data.data;
      if(invoiceSpec.status_code === 'revoke') invoiceSpec.label = "منقضی شده"
        if(invoiceSpec.status_code === 'pending') invoiceSpec.label = "در حال بررسی"
        if(invoiceSpec.status_code === 'failed') invoiceSpec.label = "نا موفق"
        if(invoiceSpec.status_code === 'ready') invoiceSpec.label = "آماده پرداخت"


        setInvoice(invoiceSpec);
    } catch (e) {
      console.log(e);
    }
    dispatch({ loading: false, type: "SHOW_LOADING" });
  };
  const getInvoiceInfo = async () => {
    //get specific item from server, but its static now
    await getSpecificInvoice();
  };
  const setHeader = () => {
    if (token)
      axiosInstance.defaults.headers.common["Authorization"] = `JWT ${token}`;
  };

  const getInvoicesPayments = async () => {
      dispatch({
          loading: true,
          type: 'SHOW_LOADING'
      });
        try {
            const response = await axiosInstance.get(`/payment/api/base-balance-bill/${props.match.params.id}`);
            setPayments({
                ...payments,
                list: response.data.data
            })
        }
        catch (e) {
            console.log(e);
            toast.error(i18next.t('Rejected'));
        }

  };

    const renderPayments = () => {

        if (payments.list.length > 0){
            return (
                payments.list.map((item) => {
                    let status = {
                        label: '',
                        color: ''
                    }
                    switch (item.status_code) {
                        case 'pending':
                            status.label= 'در حال بررسی'
                            status.color= 'text-primary text--accent-3'

                            break;
                        case 'success':
                            status.label= 'پرداخت شده'
                            status.color= 'text-success'
                            break;

                        case 'failed':
                            status.label= 'نا‌موفق'
                            status.color= 'text-danger text--darken-1'
                            break;
                        default:
                            status.label = 'نامشخص'
                            status.color = 'text-warning'
                    }
                    return <SinglePayment key={item.id} payment = {item} status={status}/>
                })
            )
        }
        else return(
            <div className="shadow-lg p-3 mb-3 bg-white rounded">
                <p className=" text-center text-secondary">{i18next.t('noDataFounded')}</p>
            </div>
        )

    }
  useEffect(() => {
    setHeader();
    getInvoiceInfo();
    getInvoicesPayments();
  }, []);
  return invoice !== undefined ? (
    <React.Fragment>
        <div className='container'>
            <Table striped bordered size="lg">
                <tbody>
                <tr>

                    <td>
                        <span className='p-3'>{`${i18next.t("InvoiceId")}: ${invoice.id}`}</span>

                    </td>
                    <td>
                        <span className='p-3'>{`${i18next.t("CreationDate")}:`}</span>
                        <Moment format="YYYY/MM/DD" locale="L">
                            {invoice.created_at_jalali}
                        </Moment>

                    </td>

                </tr>

                <tr>
                    <td>
                        <span className='p-3'>{`${i18next.t("total_cost")}: ${invoice.total_cost} ${i18next.t("rial")}`}</span>

                    </td>

                    <td>
                        <span className='p-3'>{`${i18next.t("updated_status_at_jalali")}:`}</span>
                        <Moment format="YYYY/MM/DD" locale="L">
                            {invoice.updated_status_at_jalali}
                        </Moment>

                    </td>


                </tr>
                <tr>
                    <td>
                        <span className='p-3'>{`${i18next.t("Status")}: ${invoice.label}`}</span>
                    </td>

                    <td>
                        <span className='p-3'>{`${i18next.t("payTime")}:`}</span>
                        <Moment format="YYYY/MM/DD" locale="L">
                            {invoice.due_date_jalali}
                        </Moment>

                    </td>

                </tr>
                <tr>
                    <td>
                        <span className='p-3'>{`${i18next.t("tracking_code")}: ${invoice.tracking_code}`}</span>

                    </td>
                    <td>
                        <span className='p-3'>{`${i18next.t("description")}: ${invoice.description}`}</span>

                    </td>
                </tr>

                </tbody>
            </Table>
        </div>

     <hr/>
        <div className="header-item">
            <h5 className="text-secondary">{i18next.t("paymentReport")}</h5>
        </div>
        <Table
            responsive
            className="table-borderless table-hover table-sep p-2"
        >
            <thead className="header-font text-secondary">
            <tr>
                <th>{i18next.t("receiptId")}</th>
                <th>{i18next.t("CreationDate")}</th>
                <th>{i18next.t("Price")}</th>
                <th>{i18next.t("Status")}</th>
            </tr>
            </thead>
            <tbody className="table-body-font text-secondary">
            {renderPayments()}
            </tbody>
        </Table>
    </React.Fragment>
  ) : (
    <p></p>
  );
};
export default BaseBalanceInvoiceItem;
