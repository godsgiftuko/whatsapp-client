class AuthError extends Error {
    constructor({ message, fileName, path }) {
        super(message);
        // Ensure the name of this error is the same as the class name
        this.name = this.constructor.name;
        // This clips the constructor invocation from the stack trace.
        // It's not absolutely essential, but it does make the stack trace a little nicer.
        //  @see Node.js reference (bottom)
        Error.captureStackTrace(this, this.constructor);
    }
}

class InternalError extends Error {
    constructor(error) {
        super(error.message);
        this.data = { error };
    }
}

module.exports = {
    AuthError,
    InternalError,
};
