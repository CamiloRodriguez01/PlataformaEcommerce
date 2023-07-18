import { Producto } from "../productos/ProductoI";
import { HistoryConfigI } from "./HistoryConfigI";

export interface HistoryI {
  id: number;
  created_at: string,
  config: HistoryConfigI[]
}
