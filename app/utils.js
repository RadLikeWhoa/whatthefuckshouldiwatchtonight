const parseReleaseYear = (date) => {
    const year = (new Date(date)).getFullYear()
    return !isNaN(year) ? `(${year})` : ''
}

const handleRequest = (err, res, successHandler, errorHandler) => {
    if (!err) {
        successHandler(res)
    } else {
        errorHandler(err)
    }
}

export { parseReleaseYear, handleRequest }
