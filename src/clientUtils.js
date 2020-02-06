export function isEmpty(value) {
    if (typeof value === 'string') return (value.length === 0 || !value.trim());
    return Object.keys(value).length === 0;
};

export function goto(link) {
    window.location.href = link;
}