export interface Producto {
    id: number;
    name: string;
    description: string;
    images: any[];
    category: number[];
    price:number;
    idsCarrito:number;
  }