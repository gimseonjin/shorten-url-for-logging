import { ID } from "@/core/types/id.types";

export interface ShortenUrl {
  id: ID<string>;
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