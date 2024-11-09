export interface Stock {
  id: number;                   // Identificador único para el stock
  productoId: number;           // ID del producto relacionado
  talla: string;                // Talla del producto (por ejemplo, '43')
  cantidad: number;             // Cantidad disponible en stock
  movimiento: string;           // Tipo de movimiento (por ejemplo, 'compra', 'venta', 'ajuste')
  fecha: string;                // Fecha del movimiento
  createdAt: string;            // Fecha de creación del registro
  updatedAt: string;            // Fecha de la última actualización
}
