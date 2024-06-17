class ApiError extends Error{
    statusCode: string;
    data: string | any;
    stack: string | any;
    errors: string[];
    success: Boolean

    constructor(
        statusCode: string,
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