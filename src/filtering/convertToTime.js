const msToTime = (s) => {
    let sec = s / 1000000000;
    let min = Math.ceil(sec / 60);
    // s = (s - ms) / 1000;
    // let secs = s % 60;
    // s = (s - secs) / 60;
    // let mins = s % 60;
    // let hrs = (s - mins) / 60;

    return min;
};
export default msToTime;
