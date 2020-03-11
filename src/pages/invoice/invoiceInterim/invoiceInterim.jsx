import React from "react";
import i18next from "i18next";
import { useHistory } from "react-router-dom";
import currency from "../../../filtering/currency";
import "./invoiceInterim.css";
const InvoiceInterim = props => {
  const history = useHistory();
  return (
    <React.Fragment>
      <div className="modal-items">
<p>        <span>:{i18next.t("tracking_code")}</span>
</p>
        <p><span className='tracking-code'>{props.interim.tracking_code}</span></p>
        <p>
          {i18next.t("total_cost")}: {currency(props.interim.total_cost)}
        </p>
        <p>
          {i18next.t("bill_type")}:
          {props.interim.invoice_type_code === "interim" ? "میان‌دوره" : "پایان‌دوره"}
        </p>

        <p>
          {i18next.t("CreationDate")}:{props.interim.created_at_jalali}
        </p>
        <p>{i18next.t("Status")} :پرداخت نشده </p>
        <p>مهلت پرداخت : {props.interim.to_date_jalali}</p>
        <div
          className="btn-custom pointer"
          onClick={() => {
            history.push(`/invoices/${props.interim.id}`);
          }}
        >
          {" "}
          مشاهده جزییات قبض میان‌دوره
        </div>
      </div>
    </React.Fragment>
  );
};
export default InvoiceInterim;
