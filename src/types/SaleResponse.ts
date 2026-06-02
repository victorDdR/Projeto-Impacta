import { SaleItemResponse } from "./SaleItemResponse";

export interface SaleResponse {
  id: number;
  total: number;
  saleDate: Date;
  items: SaleItemResponse[];
}