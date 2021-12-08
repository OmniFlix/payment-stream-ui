export const splitDecimals = (value) => {
    return value.toString().split('.');
};

export const commaSeparator = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
