export interface PartnerCategory {
  value: string;
  label: string;
}

export const PARTNER_CATEGORIES: PartnerCategory[] = [
  // Comercio y Retail (más común)
  { value: 'restaurant', label: 'Restaurante' },
  { value: 'grocery', label: 'Supermercado/Bodega' },
  { value: 'convenience', label: 'Tienda de Conveniencia' },
  { value: 'clothing', label: 'Ropa y Accesorios' },
  { value: 'pharmacy', label: 'Farmacia' },
  { value: 'electronics', label: 'Electrónicos' },
  { value: 'beauty', label: 'Belleza y Cuidado Personal' },
  { value: 'home', label: 'Hogar y Jardín' },
  { value: 'automotive', label: 'Automotriz' },
  { value: 'sports', label: 'Deportes y Recreación' },
  // Servicios (muy común en comunidad latina)
  { value: 'construction', label: 'Construcción' },
  { value: 'cleaning', label: 'Servicios de Limpieza' },
  { value: 'landscaping', label: 'Jardinería y Paisajismo' },
  { value: 'maintenance', label: 'Mantenimiento y Reparaciones' },
  { value: 'transportation', label: 'Transporte' },
  { value: 'catering', label: 'Catering y Eventos' },
  { value: 'childcare', label: 'Cuidado Infantil' },
  { value: 'eldercare', label: 'Cuidado de Adultos Mayores' },
  { value: 'translation', label: 'Traducción e Interpretación' },
  // Servicios Profesionales
  { value: 'legal', label: 'Servicios Legales' },
  { value: 'accounting', label: 'Contabilidad y Finanzas' },
  { value: 'insurance', label: 'Seguros' },
  { value: 'realestate', label: 'Bienes Raíces' },
  { value: 'consulting', label: 'Consultoría' },
  { value: 'technology', label: 'Tecnología' },
  { value: 'marketing', label: 'Marketing y Publicidad' },
  { value: 'networking', label: 'Networking y Redes de apoyo' },
  // Salud y Bienestar
  { value: 'healthcare', label: 'Servicios de Salud' },
  { value: 'dental', label: 'Servicios Dentales' },
  { value: 'fitness', label: 'Fitness y Gimnasios' },
  { value: 'spa', label: 'Spa y Wellness' },
  // Entretenimiento y Cultura
  { value: 'entertainment', label: 'Entretenimiento' },
  { value: 'music', label: 'Música y Eventos' },
  { value: 'education', label: 'Educación y Capacitación' },
  { value: 'travel', label: 'Viajes y Turismo' },
  // Manufactura y Distribución
  { value: 'manufacturing', label: 'Manufactura' },
  { value: 'wholesale', label: 'Distribución/Mayoreo' },
  { value: 'import_export', label: 'Importación/Exportación' },
  { value: 'food_production', label: 'Producción de Alimentos' },
  // Tradicional/Especializado
  { value: 'bakery', label: 'Panadería' },
  { value: 'barber', label: 'Barbería/Peluquería' },
  { value: 'mechanic', label: 'Taller Mecánico' },
  { value: 'laundry', label: 'Lavandería' },
  { value: 'money_services', label: 'Servicios Financieros/Remesas' },
  // Otros
  { value: 'other', label: 'Otro' }
];
