import React from "react";
import Moment from "react-moment";
import {Link} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import currency from "../../../filtering/currency";

const SinglePayment = props => {
  return (
    <tr className="tr-shadow table-tr">
      <td className="table-td">{props.payment.id}</td>
      <td className="table-td">
        <Moment format="YYYY/MM/DD" locale="L">
          {props.payment.created_at_jalali}
        </Moment>
      </td>
      <td className="table-td">{currency(props.payment.amount)}</td>
      <td className="table-td">
        <span className={`table-width-item ${props.status.color}`}>
          {props.status.label}
        </span>
      </td>
        {/*<td className='table-td'>*/}
        {/*    <Link to={`/payments/${props.payment.id}`}><FontAwesomeIcon className='active-icon' icon='eye' /></Link>*/}
        {/*</td>*/}
    </tr>
  );
};
export default SinglePayment;
