class ApiError extends Error{
    statusCode: Number;
    data: string | any;
    stack: string | any;
    errors: string[];
    success: Boolean

    constructor(
        statusCode: Number,
        message = "Something went wrong",
        errors: string[] = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.errors = errors
        this.success = false

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {
    ApiError
}