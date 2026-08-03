/**
 * Catálogo completo de productos (datos ficticios).
 * Fuente única de verdad: la usan Home (destacados), el Catálogo
 * (/categories) y el Detalle de producto (/product/:id).
 *
 * stock: cantidad de unidades disponibles. 0 = agotado.
 */
const products = [
  {
    id: 1,
    name: "Notebook HP 245 G10",
    category: "Notebooks",
    price: 1299999,
    stock: 8,
    icon: "💻",
    tag: "Más vendido",
    description:
      "Notebook liviana y potente para trabajo y estudio, con procesador AMD Ryzen 5, ideal para multitarea y uso diario prolongado.",
    specs: [
      "Procesador AMD Ryzen 5 7530U",
      "8 GB RAM / 512 GB SSD",
      "Pantalla 14\" Full HD",
      "Batería hasta 10 horas",
    ],
  },
  {
    id: 2,
    name: "Auriculares gamer RGB",
    category: "Audio",
    price: 55000,
    stock: 20,
    icon: "🎧",
    description:
      "Auriculares over-ear con sonido envolvente 7.1, micrófono desmontable y luces RGB personalizables para largas sesiones de juego.",
    specs: [
      "Sonido envolvente 7.1 virtual",
      "Micrófono desmontable con cancelación de ruido",
      "Iluminación RGB configurable",
      "Compatible con PC, PS5 y Xbox",
    ],
  },
  {
    id: 3,
    name: "Teclado mecánico gamer",
    category: "Periféricos",
    price: 70000,
    stock: 14,
    icon: "⌨️",
    description:
      "Teclado mecánico con switches rojos, retroiluminación RGB por tecla y estructura de aluminio resistente a uso intensivo.",
    specs: [
      "Switches mecánicos rojos (lineales)",
      "Retroiluminación RGB por tecla",
      "Estructura superior de aluminio",
      "Cable trenzado desmontable",
    ],
  },
  {
    id: 4,
    name: "Parlante JBL portátil",
    category: "Audio",
    price: 229546,
    stock: 11,
    icon: "🔊",
    tag: "Oferta",
    description:
      "Parlante portátil resistente al agua (IPX7) con graves potentes y hasta 12 horas de batería, ideal para exteriores.",
    specs: [
      "Resistencia al agua IPX7",
      "Batería de hasta 12 horas",
      "Conexión Bluetooth 5.3",
      "Modo party para vincular varios parlantes",
    ],
  },
  {
    id: 5,
    name: 'Smart TV Noblex 55"',
    category: "Televisores",
    price: 879989,
    stock: 6,
    icon: "📺",
    description:
      "Smart TV 4K UHD con sistema Google TV, ideal para streaming, con procesador de imagen que mejora contraste y color.",
    specs: [
      "Panel 4K UHD 55 pulgadas",
      "Sistema operativo Google TV",
      "3x HDMI / 2x USB",
      "Control por voz integrado",
    ],
  },
  {
    id: 6,
    name: "Aire acondicionado 3000F",
    category: "Climatización",
    price: 645000,
    stock: 5,
    icon: "❄️",
    description:
      "Split frío/calor de bajo consumo eléctrico, con filtro purificador de aire y control remoto con temporizador programable.",
    specs: [
      "3000 frigorías, frío/calor",
      "Clasificación energética A",
      "Filtro purificador de aire",
      "Control remoto con temporizador",
    ],
  },
  {
    id: 7,
    name: "Notebook Lenovo IdeaPad 3",
    category: "Notebooks",
    price: 1099999,
    stock: 5,
    icon: "💻",
    description:
      "Notebook compacta pensada para el día a día: navegación, oficina y estudio, con arranque rápido gracias a su almacenamiento SSD.",
    specs: [
      "Procesador Intel Core i3 12ª gen",
      "8 GB RAM / 256 GB SSD",
      "Pantalla 15.6\" Full HD",
      "Windows 11 preinstalado",
    ],
  },
  {
    id: 8,
    name: "Notebook Dell Inspiron 15",
    category: "Notebooks",
    price: 1450000,
    stock: 0,
    icon: "💻",
    description:
      "Notebook de gama media-alta con buen equilibrio entre rendimiento y portabilidad, pensada para trabajo profesional.",
    specs: [
      "Procesador Intel Core i5 13ª gen",
      "16 GB RAM / 512 GB SSD",
      "Pantalla 15.6\" Full HD antirreflejo",
      "Lector de huella digital",
    ],
  },
  {
    id: 9,
    name: "Auriculares inalámbricos Bluetooth",
    category: "Audio",
    price: 38000,
    stock: 15,
    icon: "🎧",
    tag: "Oferta",
    description:
      "Auriculares in-ear con cancelación activa de ruido, estuche de carga compacto y hasta 24 horas de batería total.",
    specs: [
      "Cancelación activa de ruido (ANC)",
      "Hasta 24 horas con estuche de carga",
      "Resistencia al sudor IPX4",
      "Bluetooth 5.2 multipunto",
    ],
  },
  {
    id: 10,
    name: "Parlante Bluetooth portátil Sony",
    category: "Audio",
    price: 95000,
    stock: 10,
    icon: "🔊",
    description:
      "Parlante compacto con sonido Extra Bass, diseño resistente a salpicaduras y hasta 16 horas de reproducción continua.",
    specs: [
      "Tecnología Extra Bass",
      "Resistencia a salpicaduras IPX4",
      "16 horas de batería",
      "Diseño compacto y liviano",
    ],
  },
  {
    id: 11,
    name: "Mouse gamer inalámbrico",
    category: "Periféricos",
    price: 32000,
    stock: 25,
    icon: "🖱️",
    description:
      "Mouse ergonómico de alta precisión con sensor óptico ajustable y conexión inalámbrica de baja latencia para gaming competitivo.",
    specs: [
      "Sensor óptico hasta 16.000 DPI",
      "Conexión inalámbrica 2.4 GHz de baja latencia",
      "Hasta 60 horas de batería",
      "6 botones programables",
    ],
  },
  {
    id: 12,
    name: 'Monitor gamer 27" 144Hz',
    category: "Periféricos",
    price: 350000,
    stock: 6,
    icon: "🖥️",
    tag: "Nuevo",
    description:
      "Monitor curvo de alta frecuencia de actualización, pensado para gaming competitivo, con tiempo de respuesta ultra bajo.",
    specs: [
      "Panel curvo 27\" Full HD",
      "144 Hz / 1 ms de respuesta",
      "Compatible con FreeSync",
      "Entradas HDMI y DisplayPort",
    ],
  },
  {
    id: 13,
    name: "Webcam Full HD",
    category: "Periféricos",
    price: 28000,
    stock: 0,
    icon: "📷",
    description:
      "Webcam con corrección automática de luz y micrófono incorporado, ideal para videollamadas y streaming.",
    specs: [
      "Resolución Full HD 1080p",
      "Corrección automática de luz",
      "Micrófono con reducción de ruido",
      "Clip universal para monitores y notebooks",
    ],
  },
  {
    id: 14,
    name: 'Smart TV Samsung 43"',
    category: "Televisores",
    price: 520000,
    stock: 9,
    icon: "📺",
    description:
      "Smart TV con procesador Crystal 4K y sistema Tizen, con acceso directo a las principales plataformas de streaming.",
    specs: [
      "Panel 4K UHD 43 pulgadas",
      "Sistema operativo Tizen",
      "Modo Juego automático",
      "Compatible con asistentes de voz",
    ],
  },
  {
    id: 15,
    name: 'Smart TV LG 65" 4K',
    category: "Televisores",
    price: 1150000,
    stock: 3,
    icon: "📺",
    tag: "Más vendido",
    description:
      "Smart TV de gran formato con procesador de imagen con IA, colores vibrantes y sonido envolvente virtual.",
    specs: [
      "Panel 4K UHD 65 pulgadas",
      "Procesador con IA (upscaling)",
      "webOS con apps de streaming",
      "4x HDMI 2.1, ideal para consolas",
    ],
  },
  {
    id: 16,
    name: "Heladera No Frost 340L",
    category: "Hogar",
    price: 980000,
    stock: 4,
    icon: "🧊",
    description:
      "Heladera con freezer superior y sistema No Frost, que evita la formación de escarcha y mantiene una temperatura estable.",
    specs: [
      "Capacidad total 340 litros",
      "Sistema No Frost",
      "Clasificación energética A+",
      "Estantes de vidrio templado",
    ],
  },
  {
    id: 17,
    name: "Lavarropas automático 8kg",
    category: "Hogar",
    price: 750000,
    stock: 7,
    icon: "🌀",
    description:
      "Lavarropas de carga frontal con múltiples programas de lavado y función de centrifugado de alta eficiencia.",
    specs: [
      "Capacidad 8 kg",
      "12 programas de lavado",
      "Centrifugado hasta 1000 RPM",
      "Bajo consumo de agua",
    ],
  },
  {
    id: 18,
    name: "Microondas digital 25L",
    category: "Hogar",
    price: 145000,
    stock: 12,
    icon: "🍽️",
    description:
      "Microondas con panel digital y funciones de descongelado automático, práctico para el uso diario en la cocina.",
    specs: [
      "Capacidad 25 litros",
      "Panel de control digital",
      "Descongelado automático por peso",
      "10 niveles de potencia",
    ],
  },
  {
    id: 19,
    name: "Ventilador de pie",
    category: "Climatización",
    price: 65000,
    stock: 18,
    icon: "🌀",
    description:
      "Ventilador de pie con altura regulable, oscilación automática y control remoto, ideal para espacios amplios.",
    specs: [
      "Altura ajustable",
      "Oscilación automática 90°",
      "3 velocidades de viento",
      "Control remoto incluido",
    ],
  },
  {
    id: 20,
    name: "Aire acondicionado Split 4500F",
    category: "Climatización",
    price: 890000,
    stock: 0,
    icon: "❄️",
    description:
      "Split frío/calor de mayor potencia para ambientes grandes, con tecnología Inverter para un consumo eléctrico más eficiente.",
    specs: [
      "4500 frigorías, frío/calor",
      "Tecnología Inverter",
      "Modo silencioso nocturno",
      "Wi-Fi integrado para control remoto",
    ],
  },
  {
    id: 21,
    name: "Estufa infrarroja",
    category: "Climatización",
    price: 120000,
    stock: 10,
    icon: "🔥",
    description:
      "Estufa de bajo consumo con tecnología infrarroja, calienta rápido sin resecar el ambiente y cuenta con protección antivuelco.",
    specs: [
      "Tecnología infrarroja de cuarzo",
      "3 niveles de potencia",
      "Protección antivuelco y sobrecalentamiento",
      "Diseño compacto",
    ],
  },
  {
    id: 22,
    name: "Smartphone Samsung Galaxy A55",
    category: "Smartphones",
    price: 620000,
    stock: 14,
    icon: "📱",
    tag: "Oferta",
    description:
      "Smartphone de gama media con pantalla AMOLED, cámara triple y batería de larga duración para el uso diario.",
    specs: [
      "Pantalla AMOLED 6.6\"",
      "128 GB de almacenamiento",
      "Cámara triple 50 MP",
      "Batería 5000 mAh",
    ],
  },
  {
    id: 23,
    name: "Smartphone Motorola Edge 40",
    category: "Smartphones",
    price: 540000,
    stock: 8,
    icon: "📱",
    description:
      "Smartphone delgado y liviano con pantalla curva OLED y carga rápida, pensado para quienes buscan diseño y rendimiento.",
    specs: [
      "Pantalla curva OLED 6.55\"",
      "256 GB de almacenamiento",
      "Carga rápida 68W",
      "Resistencia al agua IP68",
    ],
  },
  {
    id: 24,
    name: "iPhone 14 128GB",
    category: "Smartphones",
    price: 1350000,
    stock: 2,
    icon: "📱",
    description:
      "iPhone 14 con chip A15 Bionic, sistema de cámaras avanzado y Modo Acción para video estabilizado.",
    specs: [
      "Chip A15 Bionic",
      "128 GB de almacenamiento",
      "Cámara dual con Modo Acción",
      "Resistencia al agua IP68",
    ],
  },
  {
    id: 25,
    name: "Consola PlayStation 5",
    category: "Gaming",
    price: 950000,
    stock: 5,
    icon: "🎮",
    tag: "Más vendido",
    description:
      "Consola de última generación con SSD ultra rápido, gráficos en 4K y control DualSense con feedback háptico.",
    specs: [
      "SSD ultra rápido 825 GB",
      "Gráficos hasta 4K a 120 fps",
      "Control DualSense con feedback háptico",
      "Retrocompatible con PS4",
    ],
  },
  {
    id: 26,
    name: "Consola Xbox Series S",
    category: "Gaming",
    price: 610000,
    stock: 0,
    icon: "🎮",
    description:
      "Consola compacta todo digital, ideal para juego fluido en 1440p con tiempos de carga muy reducidos.",
    specs: [
      "512 GB de almacenamiento SSD",
      "Resolución hasta 1440p a 120 fps",
      "100% digital (sin lector de discos)",
      "Compatible con Xbox Game Pass",
    ],
  },
  {
    id: 27,
    name: "Silla gamer ergonómica",
    category: "Gaming",
    price: 280000,
    stock: 9,
    icon: "🪑",
    description:
      "Silla ergonómica con soporte lumbar ajustable, reposabrazos 4D y reclinación hasta 165°, ideal para sesiones largas.",
    specs: [
      "Soporte lumbar y cervical ajustable",
      "Reposabrazos 4D",
      "Reclinación hasta 165°",
      "Base de metal con ruedas silenciosas",
    ],
  },
  {
    id: 28,
    name: "Impresora multifunción",
    category: "Cómputo",
    price: 165000,
    stock: 11,
    icon: "🖨️",
    description:
      "Impresora multifunción con sistema de tinta continua, ideal para imprimir, escanear y fotocopiar con bajo costo por página.",
    specs: [
      "Impresión, escaneo y fotocopiado",
      "Sistema de tinta continua",
      "Conexión Wi-Fi",
      "Impresión a doble cara automática",
    ],
  },
  {
    id: 29,
    name: "Disco SSD 1TB",
    category: "Cómputo",
    price: 85000,
    stock: 30,
    icon: "💽",
    description:
      "Unidad de estado sólido de alta velocidad, ideal para acelerar el arranque del sistema y la carga de aplicaciones.",
    specs: [
      "Capacidad 1 TB",
      "Interfaz SATA III",
      "Velocidad de lectura hasta 560 MB/s",
      "Compatible con notebooks y PC de escritorio",
    ],
  },
  {
    id: 30,
    name: "Router WiFi 6",
    category: "Cómputo",
    price: 72000,
    stock: 16,
    icon: "📡",
    description:
      "Router de última generación con tecnología WiFi 6, mayor velocidad y estabilidad para hogares con muchos dispositivos conectados.",
    specs: [
      "Tecnología WiFi 6 (802.11ax)",
      "Doble banda 2.4 GHz / 5 GHz",
      "4 antenas de alta ganancia",
      "Soporta más de 30 dispositivos simultáneos",
    ],
  },
  {
    id: 31,
    name: "Cafetera automática",
    category: "Electrodomésticos",
    price: 210000,
    stock: 6,
    icon: "☕",
    description:
      "Cafetera automática con molinillo integrado, ideal para preparar café de grano recién molido con solo tocar un botón.",
    specs: [
      "Molinillo de café integrado",
      "Depósito de agua 1.5 L",
      "Función de apagado automático",
      "Sistema antigoteo",
    ],
  },
  {
    id: 32,
    name: "Licuadora de alta potencia",
    category: "Electrodomésticos",
    price: 89000,
    stock: 20,
    icon: "🥤",
    description:
      "Licuadora de alta potencia con vaso de vidrio resistente, ideal para batidos, smoothies y triturado de hielo.",
    specs: [
      "Motor de 1000 W",
      "Vaso de vidrio de 1.5 L",
      "Función pulso y triturado de hielo",
      "Cuchillas de acero inoxidable",
    ],
  },
  {
    id: 33,
    name: "Aspiradora robot",
    category: "Electrodomésticos",
    price: 430000,
    stock: 0,
    icon: "🤖",
    description:
      "Aspiradora robot con mapeo inteligente del hogar, control por app y auto-carga cuando la batería está por agotarse.",
    specs: [
      "Mapeo inteligente por láser",
      "Control desde app móvil",
      "Auto-carga automática",
      "Batería con hasta 120 min de autonomía",
    ],
  },
];

/** Lista de categorías únicas presentes en el catálogo, ordenadas alfabéticamente. */
export const categories = [...new Set(products.map((p) => p.category))].sort((a, b) =>
  a.localeCompare(b, "es")
);

/** Devuelve un producto por id (number o string), o undefined si no existe. */
export function getProductById(id) {
  const numericId = Number(id);
  return products.find((product) => product.id === numericId);
}

/** Devuelve hasta `limit` productos de la misma categoría, excluyendo el propio producto. */
export function getRelatedProducts(product, limit = 4) {
  if (!product) return [];
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

export default products;
