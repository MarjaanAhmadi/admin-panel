import React from 'react';
import moment from "jalali-moment";
import './successPay.css';
import currency from "../../filtering/currency";

const SuccessPay = (props) => {
    return(
        <React.Fragment>
            {
                    props.status === 'success' ?
                                            <div>
                                                <div className='header text-success'>پرداخت شما با موفقیت انجام شد</div>
                                                <div className='content'>
                                                   <div className='message'>
                                                       {`.پرداخت شما به مبلغ ${currency(props.item.total_cost)} ربال در تاریخ ${moment(props.item.updated_status_at_jalali, 'jYYYY/jMM/jDD').format('jYYYY/jMM/jDD')} در ساعت ${moment(props.item.updated_status_at_jalali, 'HH:mm:ss').format('HH:mm:ss')}با موفقیت انجام شد `}
                                                   </div>
                                                    <div>‍‍‍‍{` ${props.item.tracking_code}: کد پیگیری `}</div>
                                                </div>
                                            </div>
                    : props.item.payments.length > 0 ?
                        <div>
                            <div className='header text-danger'>پرداخت شما با مشکل مواجه شد</div>
                            <div className='content'>
                                <div className='message'>
                                    .لطفا مجددا تلاش نمایید
                                </div>
                            </div>
                        </div>
                        :
                        <div>
                            <div className='header text-warning'>.برای این قبض پرداختی وجود ندارد</div>

                        </div>
            }

        </React.Fragment>
    )
};
export default SuccessPay;
