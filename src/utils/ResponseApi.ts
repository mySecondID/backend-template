class ApiResponse{
    statusCode: Number;
    data: string;
    message: string;

    constructor(
        statusCode: Number,
        data: string,
        message="success"
    ){
        this.statusCode = statusCode
        this.data = data
        this.message = message
    }
}

export {
    ApiResponse
}