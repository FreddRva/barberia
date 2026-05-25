export const DEFAULT_USERS = [
  { id: 1, username: "admin", password_hash: "admin", nombre: "Alejandro Rossi", email: "admin@barberia.com", telefono: "987654321", rolId: 1, activo: true },
  { id: 2, username: "barbero_carlos", password_hash: "barbero", nombre: "Carlos Mendoza", email: "barbero@barberia.com", telefono: "912345678", rolId: 2, activo: true },
  { id: 3, username: "cliente_juan", password_hash: "cliente", nombre: "Juan Pérez García", email: "cliente@barberia.com", telefono: "934567890", rolId: 3, activo: true },
  { id: 4, username: "barbero_enzo", password_hash: "enzo123", nombre: "Enzo Frattini", email: "enzo@barberia.com", telefono: "922883344", rolId: 2, activo: true },
  { id: 5, username: "barbero_lucas", password_hash: "lucas123", nombre: "Lucas Silva", email: "lucas@barberia.com", telefono: "911556677", rolId: 2, activo: true }
];

export const DEFAULT_ROLES = [
  { id: 1, nombre_rol: "Admin", permisos: ["Ver Dashboard", "Gestionar Usuarios", "Gestionar Barberos", "Gestionar Cortes", "Gestionar Inventario", "Gestionar Proveedores", "Ver Reportes"] },
  { id: 2, nombre_rol: "Empleado", permisos: ["Ver Dashboard", "Ver Agenda", "Registrar Movimientos Inventario"] },
  { id: 3, nombre_rol: "Cliente", permisos: ["Ver Catalogo", "Reservar Cita", "Ver Puntos", "Ver Historial"] }
];

export const DEFAULT_CLIENTES = [{ id: 1, usuarioId: 3, fecha_registro: "2026-01-15", puntos_saldo: 120 }];

export const DEFAULT_BARBEROS = [
  { id: 1, usuarioId: 2, ruc_dni: "10765432101", sueldo_base: 1500.00, comision_porcentaje: 25, estado_laboral: "Activo", especialidad: "Cortes Clásicos y Modernos" },
  { id: 2, usuarioId: 4, ruc_dni: "10987654321", sueldo_base: 1400.00, comision_porcentaje: 20, estado_laboral: "Activo", especialidad: "Barba y Afeitados Tradicionales" },
  { id: 3, usuarioId: 5, ruc_dni: "10112233445", sueldo_base: 1600.00, comision_porcentaje: 30, estado_laboral: "Activo", especialidad: "Estilista y Colorimetría Capilar" }
];

export const DEFAULT_SERVICIOS = [
  { id: 1, nombre: "Corte L'Élite Signature", descripcion: "Corte de cabello premium con lavado, peinado con cera orgánica.", precio: 60.00, duracion_minutos: 45, perfil_cliente: "Caballeros", imagen: "service_classic.png" },
  { id: 2, nombre: "Afeitado a Navaja Tradicional", descripcion: "Afeitado clásico al estilo vieja escuela con toallas calientes.", precio: 40.00, duracion_minutos: 30, perfil_cliente: "Barba", imagen: "service_beard.png" },
  { id: 3, nombre: "Combo Corte + Barba de Lujo", descripcion: "El servicio definitivo que combina el corte y el perfilado de barba.", precio: 90.00, duracion_minutos: 75, perfil_cliente: "Caballeros", imagen: "service_classic.png" },
  { id: 4, nombre: "Tinte y Colorimetría Capilar", descripcion: "Cambios de color o cobertura de canas con tintes libres de amoníaco.", precio: 120.00, duracion_minutos: 90, perfil_cliente: "Modernos", imagen: "service_classic.png" },
  { id: 5, nombre: "Tratamiento Facial Exfoliante", descripcion: "Limpieza facial profunda con exfoliación natural y vapor de ozono.", precio: 50.00, duracion_minutos: 35, perfil_cliente: "Cuidado de la piel", imagen: "service_facial.png" }
];

export const DEFAULT_INVENTARIO = [
  { id: 1, tipo: "Venta", nombre: "Pomada Modeladora Gold Matte (120g)", stock_actual: 22, stock_minimo: 5, precio_venta: 45.00, puntos_que_otorga: 15, unidad_medida: "" },
  { id: 2, tipo: "Venta", nombre: "Aceite Orgánico para Barba (50ml)", stock_actual: 3, stock_minimo: 6, precio_venta: 55.00, puntos_que_otorga: 20, unidad_medida: "" },
  { id: 3, tipo: "Venta", nombre: "Champú Revitalizante con Mentol (250ml)", stock_actual: 15, stock_minimo: 5, precio_venta: 38.00, puntos_que_otorga: 12, unidad_medida: "" },
  { id: 4, tipo: "Insumo", nombre: "Toallas Blancas de Algodón", stock_actual: 50, stock_minimo: 10, precio_venta: 0, puntos_que_otorga: 0, unidad_medida: "Unidades" },
  { id: 5, tipo: "Insumo", nombre: "Gel de Afeitar Transparente (2L)", stock_actual: 2, stock_minimo: 3, precio_venta: 0, puntos_que_otorga: 0, unidad_medida: "Litros" }
];

export const DEFAULT_PROVEEDORES = [
  { id: 1, ruc: "20601234567", razon_social: "Distribuidora Barber Pro S.A.C.", contacto_telefono: "955443322" },
  { id: 2, ruc: "20556677881", razon_social: "L'Oréal Profesionales S.A.", contacto_telefono: "944887711" }
];

export const DEFAULT_CITAS = [
  { id: 1001, clienteId: 1, barberoId: 1, fecha_reserva: "2026-05-24T10:00:00", fecha_programada: "2026-05-25", hora_programada: "10:00 AM", serviciosIds: [1, 2], estado_actual: "Confirmada", monto_adelanto: 20.00, total: 100.00, metodo_pago: "Yape" },
  { id: 1002, clienteId: 1, barberoId: 2, fecha_reserva: "2026-05-23T14:30:00", fecha_programada: "2026-05-26", hora_programada: "03:00 PM", serviciosIds: [3], estado_actual: "Pendiente", monto_adelanto: 18.00, total: 90.00, metodo_pago: "Tarjeta" },
  { id: 1003, clienteId: 1, barberoId: 1, fecha_reserva: "2026-05-20T16:00:00", fecha_programada: "2026-05-20", hora_programada: "11:00 AM", serviciosIds: [1], estado_actual: "Completada", monto_adelanto: 12.00, total: 60.00, metodo_pago: "Efectivo" }
];

export const DEFAULT_PAGOS = [
  { id: 2001, citaId: 1001, fecha: "2026-05-24T10:05:00", monto_total: 20.00, metodo_pago: "Yape", comprobante: "B001-0004561", estado_pago: "Completado" },
  { id: 2002, citaId: 1002, fecha: "2026-05-23T14:32:00", monto_total: 18.00, metodo_pago: "Tarjeta", comprobante: "B001-0004562", estado_pago: "Pendiente" },
  { id: 2003, citaId: 1003, fecha: "2026-05-20T11:45:00", monto_total: 60.00, metodo_pago: "Efectivo", comprobante: "B001-0004559", estado_pago: "Completado" }
];

export const DEFAULT_HISTORIAL_PUNTOS = [{ id: 1, clienteId: 1, fecha: "2026-05-20T11:45:00", cantidad: 15, motivo: "Compra de Pomada Gold" }];

export const DEFAULT_HISTORIAL_CITAS = [
  { id: 1, citaId: 1001, fecha_cambio: "2026-05-24T10:00:00", estado_anterior: "Nueva", estado_nuevo: "Confirmada" },
  { id: 2, citaId: 1002, fecha_cambio: "2026-05-23T14:30:00", estado_anterior: "Nueva", estado_nuevo: "Pendiente" },
  { id: 3, citaId: 1003, fecha_cambio: "2026-05-20T11:00:00", estado_anterior: "Confirmada", estado_nuevo: "Completada" }
];

export const DEFAULT_HISTORIAL_STOCK = [
  { id: 1, itemId: 1, fecha: "2026-05-20T08:00:00", tipo_movimiento: "ENTRADA", cantidad: 20 },
  { id: 2, itemId: 2, fecha: "2026-05-22T10:00:00", tipo_movimiento: "SALIDA", cantidad: 2 }
];

export const DEFAULT_ORDEN_COMPRA = [{ id: 3001, proveedorId: 1, fecha_ingreso: "2026-05-18", total_costo: 300.00, detalles: [{ itemId: 1, cantidad: 10, precio_costo_unitario: 30.00 }] }];
