export const formatCurrency = (value: number): string => {
    return isNaN(value) ? ' 0' : value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
}

export const formatPercentage = (value: number ): string => {
    return isNaN(value) ? '0%' : `${parseFloat(value.toFixed(6))}%`
}


export const safeFormatCurrency = (value: any): string => {
    if (typeof value === undefined || value === null || isNaN(parseFloat(value))) {
        return formatCurrency(0);
    }
    if (typeof value === 'number') {
        return formatCurrency(value);
    }
    return formatCurrency(parseFloat(value));
};

export const safeFormatPercentage = (value: any): string => {
    if (typeof value === undefined || value === null || isNaN(parseFloat(value))) {
        return formatPercentage(0);
    }
    if (typeof value === 'number') {
        return formatPercentage(Number(value.toFixed(2)));
    }
    return formatPercentage(Number(parseFloat(value).toFixed(2)));
};

export const toTitleCase = (str: string): string => {
    return str?.split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}