
function addToken (header) {
    const jtoken = window.sessionStorage.getItem(process.env.TOKEN)
    return { ...header, Authorization: `Bearer ${jtoken}` }
}

const fh = {
    addToken
}

export default fh