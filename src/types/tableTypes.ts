// src/types/tableTypes.ts

export interface TablePosition {
  x: number;
  y: number;
}

export interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string; 
}

export type TableStatus = "available" | "reserved" | "occupied" | "unavailable";

export interface QRCodeData {
  token: string;
  expiresAt: string;
  isValid: boolean;
}

export interface TableData {
  _id?: string;
  id?: string;
  number: number;
  capacity: number;
  status?: TableStatus;
  position: TablePosition;
  currentOrder?: string | null;
  qrCode?: QRCodeData;
  createdAt?: string;
  updatedAt?: string;
}

export interface TableCreateRequest {
  number: number;
  capacity: number;
  position: TablePosition;
  status?: TableStatus;
}

export interface TableUpdateRequest {
  number?: number;
  capacity?: number;
  position?: TablePosition;
  status?: TableStatus;  
}

export interface TableStatusUpdateRequest {
  status: TableStatus;
}

export interface QRCodeResponse {
  tableId: string;
  tableNumber: number;
  restaurantId: string;
  qrToken?: string;
  expiresAt?: string;
  dataURL?: string;
}

export interface QRValidationRequest {
  qrData: string | {
    r: string; // restaurantId
    t: string; // tableId
    v: string; // verification token
    ts: number; // timestamp
  };
}

export interface QRValidationResponse {
  validated: boolean;
  table: TableData;
  sessionToken: string;
}