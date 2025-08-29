import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { EXCLUDE_TOKEN_ENDPOINTS } from "./config";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const isExcluded = EXCLUDE_TOKEN_ENDPOINTS.some((endpoint: string) =>
      config?.url?.endsWith(endpoint)
    );

    if (!isExcluded) {
      const user = localStorage.getItem("persist:user");
      const parsedUser = user ? JSON.parse(user) : null;
      const token = parsedUser?.token.replace(/"/g, "") ?? null;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) =>
    Promise.reject(error instanceof Error ? error : new Error(String(error)))
);

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export class ApiService {
  private static handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status ?? 500;
      const data = axiosError.response?.data as any;

      const message =
        typeof data === "string"
          ? data
          : (data?.detail ??
            data?.message ??
            data?.error ??
            (Array.isArray(data?.errors) && data.errors[0]?.msg) ??
            (typeof data?.errors === "object" &&
              Object.values(data.errors)[0]) ??
            (error.message || "Unknown error occurred"));

      throw new ApiError(status, message, data);
    }

    if (error instanceof Error) {
      throw new ApiError(500, error.message);
    }
    throw new ApiError(500, "Unknown error occurred");
  }

  public static async get<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.get(
        endpoint,
        config
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public static async post<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.post(
        endpoint,
        data,
        config
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public static async postFormData<T>(
    endpoint: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.post(
        endpoint,
        formData,
        {
          ...config,
          headers: {
            ...config?.headers,
          },
        }
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public static async put<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.put(
        endpoint,
        data,
        config
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public static async patch<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.patch(
        endpoint,
        data,
        config
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public static async delete<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.delete(endpoint, {
        ...config,
        data,
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
}
