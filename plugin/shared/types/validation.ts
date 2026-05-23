export interface ValidationResult {
  errors: Array<{
    keyword: string;
    message: string;
    params: Record<string, any>;
    path: string;
  }> | null;
  errorString?: string;
  isValid: boolean;
  processingError?: string;
}
