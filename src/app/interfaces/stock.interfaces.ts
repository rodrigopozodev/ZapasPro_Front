export interface Stock {
    id: number; // ID opcional
    fecha: string; // Fecha del movimiento
    producto: string; // Nombre del producto
    talla: string; // Talla del producto
    cantidad: number; // Cantidad del producto
    movimiento: 'compra' | 'venta' | 'ajuste'; // Tipo de movimiento
}
