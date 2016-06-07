/**
 * Parse the year from a date string and return it, wrapped in parentheses. If
 * the date could not be parsed an empty string is returned.
 *
 * @param   {date}  date  The date to get the year from.
 *
 * @return  {string}
 */

const parseReleaseYear = (date) => {
    const year = (new Date(date)).getFullYear()
    return !isNaN(year) ? `(${year})` : ''
}

/**
 * Handle the response from an asynchronous request. A success or error handler
 * is called depending on whether there were any errors.
 *
 * @param   {object}  err             An object containing error information
 *                                    from the request.
 * @param   {object}  res             An object containing response information
 *                                    from the request.
 * @param   {func}    successHandler  This callback is executed if the error
 *                                    object is empty.
 * @param   {func}    errorHandler    This callback is executed if the error
 *                                    object is not empty.
 *
 * @return  {void}
 */

const handleRequest = (err, res, successHandler, errorHandler) => {
    if (!err) {
        successHandler(res)
    } else {
        errorHandler(err)
    }
}

export { parseReleaseYear, handleRequest }
