import React, {useEffect, useState} from "react";
import i18next from "i18next";
import axiosInstance from "../../../routing/axios";
import {useDispatch, useSelector} from "react-redux";
const PaymentItem = (props) => {

    const dispatch = useDispatch();
    const token = useSelector(state => state.token);
    const [payment, setPayment] = useState({})
    const getSpecificPayment = async () => {
        dispatch({loading: true, type: 'SHOW_LOADING'});
        try {
            const response = await axiosInstance.get(`/payment/api/payment/${props.match.params.id}`);
            setPayment(response.data.data);
        }
        catch (e) {
            console.log(e)
        }
        dispatch({loading: false, type: 'SHOW_LOADING'});

    }

    const setHeader = () => {
        if (token) axiosInstance.defaults.headers.common['Authorization'] = `JWT ${token}`;
    }

    useEffect(()=>{
        setHeader();
        getSpecificPayment();
    },[])
    return(
        <React.Fragment>
            <div className='row'>
                <span className='p-3'>{`${i18next.t('receiptId')}: ${payment.id}`}</span>
                <span className='p-3'>{`${i18next.t('Price')}: ${payment.amount}`}</span>
                <span className='p-3'>{`${i18next.t('CreationDate')}: ${payment.updated_at_jalali}`}</span>
                <span className='p-3'>{`${i18next.t('extra_data')}: ${payment.extra_data}`}</span>
                <span className='p-3'>{`${i18next.t('mis')}: ${payment.gateway}`}</span>
                <span className='p-3'>
                {
                    payment.status_code === 'success' ? 'پرداخت شده' : payment.status_code === 'failed' ? 'پرداخت نشده' : 'آماده پرداخت'
                }
            </span>
            </div>


        </React.Fragment>
    )
}
export default PaymentItem;
