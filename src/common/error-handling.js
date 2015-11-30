exports.handleError = handleError;

function handleError(next, err) {
    if (err) {
        return next(err);
    }
}
