export interface BaseResponse<T> {
    status: string;
    message: string;
    data: T;
    meta?: any;
    timestamp?: string;
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