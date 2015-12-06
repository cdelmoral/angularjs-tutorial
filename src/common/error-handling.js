exports.handleError = handleError;

function handleError(errorFn, err) {
    if (err) {
        return errorFn(err);
    }
}
