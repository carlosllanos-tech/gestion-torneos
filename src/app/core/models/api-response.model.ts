export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errors?: ErrorDetail[] | string;
    total?: number;
}

export interface ErrorDetail {
    type: string;
    msg: string;
    path: string;
    location: string;
}

export interface HttpError {
    status: number;
    message: string;
    errors?: ErrorDetail[] | string;
}
