const currency = (value) => {
    return String(Math.floor(value)).replace(/(.)(?=(.{3})+$)/g, '$1,')
}
export default currency;
