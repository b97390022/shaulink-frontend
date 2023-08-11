import Cookies from 'js-cookie';

const getCookie = (key) => {
    return Cookies.get(key)
}

const setCookie = (key, value, path) => {
    Cookies.set(key, value, { expires: 1, path: path !== undefined ? path : ''})
}

const removeCookie = (key, path = '') => {
    Cookies.remove(key, { path: `/${path}` })
}

export { getCookie, setCookie, removeCookie }