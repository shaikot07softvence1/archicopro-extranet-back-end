export class ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: any;

  constructor(success: boolean, message: string, data?: T, meta?: any) {
    this.success = success;
    this.message = message;
    if (data !== undefined) this.data = data;
    if (meta !== undefined) this.meta = meta;
  }

  static success<T>(message: string, data?: T, meta?: any) {
    return new ApiResponse<T>(true, message, data, meta);
  }

  static error(message: string, meta?: any) {
    return new ApiResponse(false, message, undefined, meta);
  }
}
