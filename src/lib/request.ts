interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

const BASE_URL = process.env.NODE_ENV === "production" ? "/PrismBackend" : "";

class Request {
  async get<T>(url: string): Promise<T> {
    const res = await fetch(BASE_URL + url);
    const data: ApiResponse<T> = await res.json();

    if (data.success) {
      return data.data;
    } else {
      throw new ApiError(data.message, res.status);
    }
  }

  async post<T>(url: string, body: any, formDataContent?: boolean): Promise<T> {
    const res = await fetch(BASE_URL + url, {
      method: "POST",
      headers: formDataContent ? {} : { "Content-Type": "application/json" },
      credentials: "include",
      body: formDataContent ? body : JSON.stringify(body),
    });
    const data: ApiResponse<T> = await res.json();

    if (data.success) {
      return data.data;
    } else {
      throw new ApiError(data.message, res.status);
    }
  }

  async put<T>(url: string, body: any, formDataContent?: boolean): Promise<T> {
    const res = await fetch(BASE_URL + url, {
      method: "PUT",
      headers: formDataContent ? {} : { "Content-Type": "application/json" },
      body: body,
    });
    const data: ApiResponse<T> = await res.json();

    if (data.success) {
      return data.data;
    } else {
      throw new ApiError(data.message, res.status);
    }
  }

  async delete<T>(url: string, body?: any): Promise<T> {
    const res = await fetch(BASE_URL + url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data: ApiResponse<T> = await res.json();

    if (data.success) {
      return data.data;
    } else {
      throw new ApiError(data.message, res.status);
    }
  }
}

const request = new Request();

export default request;
