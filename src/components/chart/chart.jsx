import React, {useEffect, useState} from 'react';
import C3Chart from 'react-c3js';
import {useDispatch} from "react-redux";
import axiosInstance from "../../routing/axios";
import './chart.css';
const Chart = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState({
        columns: [],
        type : 'pie',
        colors: {
            'اعتبار پایه فعلی': '#818181',
            'اعتبار پایه مصرفی' : '#6610f2'
        },
        tooltip: { format: { value: function (value, ratio, id) { return (value).formatSomehow(); } } }
    })
    // const data = {
    //     columns: [
    //         ['data1', 30, 200, 100, 400, 150, 250],
    //         ['data2', 50, 20, 10, 40, 15, 25],
    //     ],
    //
    // };
    const getMainNumbers = async () => {
        dispatch({loading:true, type: 'SHOW_LOADING'})

        try {
            //request to get list
            const response = await axiosInstance.get('/gateway/api/gateway/')
            //change main numbers state
            setData({
                ...data,
                columns: [
                    ['اعتبار پایه فعلی', response.data.data[0].current_balance],
                    ['اعتبار پایه مصرفی', response.data.data[0].used_balance]
                ]
            })
        }
        catch (e) {
            console.log(e)
        }
        dispatch({loading:false, type: 'SHOW_LOADING'})


    };
    useEffect(() => {
        getMainNumbers()
    },[])
    return(

        <C3Chart pie={true} data={data} />
    )
}
export default Chart;
