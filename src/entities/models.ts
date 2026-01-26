export interface BaseResponse<T> {
    message: string;
    data: T;
    meta?: any;
}

export interface PaginationMeta {
    total: number;
    limit: number;
    offset: number;
}

export interface PaginatedResponse<T> {
    message: string;
    data: T;
    pagination: PaginationMeta;
}