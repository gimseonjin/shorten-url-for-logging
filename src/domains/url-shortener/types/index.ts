export interface ShortenUrl {
  originalUrl: string;
  shortenUrlKey: string;
  redirectCount: number;
}

export interface CreateUrlRequest {
  originalUrl: string;
}

export interface ShortenUrlResponse {
  originalUrl: string;
  shortenUrl: string;
  shortenUrlKey: string;
  redirectCount: number;
}