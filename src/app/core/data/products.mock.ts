import { Product } from '../models/product.model';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Notebook Nova 14',
    description: 'Notebook liviana para estudio, trabajo remoto y productividad diaria.',
    price: 980000,
    discountPercentage: 12,
    taxPercentage: 21,
    taxLabel: 'IVA',
    category: 'Tecnologia',
    subcategory: 'Notebooks',
    attributes: [
      { name: 'Memoria', value: '16 GB' },
      { name: 'Almacenamiento', value: '512 GB' },
      { name: 'Pantalla', value: '14 pulgadas' }
    ],
    image: 'assets/products/notebook.svg',
    images: ['assets/products/notebook.svg', 'assets/products/cable.svg', 'assets/products/organizer.svg'],
    stock: 7,
    featured: true,
    features: ['Pantalla 14 pulgadas', 'SSD 512 GB', '16 GB RAM', 'Bateria de larga duracion']
  },
  {
    id: 2,
    name: 'Auriculares Pulse',
    description: 'Auriculares inalambricos con cancelacion pasiva y estuche compacto.',
    price: 85000,
    discountPercentage: 18,
    category: 'Tecnologia',
    subcategory: 'Audio',
    attributes: [
      { name: 'Conexion', value: 'Bluetooth' },
      { name: 'Autonomia', value: '24 horas' },
      { name: 'Carga', value: 'USB-C' }
    ],
    image: 'assets/products/headphones.svg',
    images: ['assets/products/headphones.svg', 'assets/products/cable.svg'],
    stock: 18,
    featured: true,
    features: ['Bluetooth 5.3', 'Microfono integrado', '24 horas de autonomia', 'Carga USB-C']
  },
  {
    id: 3,
    name: 'Lampara Nordica',
    description: 'Lampara de mesa con base metalica y luz calida para espacios de trabajo.',
    price: 42000,
    taxPercentage: 10.5,
    taxLabel: 'IVA reducido',
    category: 'Hogar',
    subcategory: 'Iluminacion',
    attributes: [
      { name: 'Tipo de luz', value: 'LED calida' },
      { name: 'Uso', value: 'Escritorio' },
      { name: 'Material', value: 'Metal' }
    ],
    image: 'assets/products/lamp.svg',
    images: ['assets/products/lamp.svg', 'assets/products/organizer.svg'],
    stock: 11,
    featured: false,
    features: ['Luz LED calida', 'Cabezal orientable', 'Bajo consumo', 'Base antideslizante']
  },
  {
    id: 4,
    name: 'Mochila Urbana',
    description: 'Mochila resistente con compartimento para notebook y bolsillos internos.',
    price: 69000,
    discountPercentage: 15,
    category: 'Accesorios',
    subcategory: 'Mochilas',
    attributes: [
      { name: 'Capacidad', value: '22 L' },
      { name: 'Material', value: 'Impermeable' },
      { name: 'Compartimento', value: 'Notebook' }
    ],
    image: 'assets/products/backpack.svg',
    images: ['assets/products/backpack.svg', 'assets/products/notebook.svg', 'assets/products/bottle.svg'],
    stock: 15,
    featured: true,
    features: ['Capacidad 22 L', 'Tela impermeable', 'Bolsillo para notebook', 'Correas acolchadas']
  },
  {
    id: 5,
    name: 'Campera Softshell',
    description: 'Campera liviana para uso urbano con proteccion contra viento.',
    price: 125000,
    discountPercentage: 10,
    category: 'Indumentaria',
    subcategory: 'Abrigos',
    attributes: [
      { name: 'Tela', value: 'Softshell' },
      { name: 'Corte', value: 'Regular' },
      { name: 'Proteccion', value: 'Viento' }
    ],
    image: 'assets/products/jacket.svg',
    images: ['assets/products/jacket.svg', 'assets/products/cap.svg'],
    stock: 6,
    variants: [
      { id: 'jacket-negro-m', options: { Color: 'Negro', Talle: 'M' }, stock: 2 },
      { id: 'jacket-negro-l', options: { Color: 'Negro', Talle: 'L' }, stock: 1 },
      { id: 'jacket-azul-m', options: { Color: 'Azul', Talle: 'M' }, stock: 2 },
      { id: 'jacket-azul-xl', options: { Color: 'Azul', Talle: 'XL' }, stock: 1 }
    ],
    featured: false,
    features: ['Tela respirable', 'Cierre frontal', 'Bolsillos laterales', 'Corte regular']
  },
  {
    id: 6,
    name: 'Set de Cocina Terra',
    description: 'Set basico de utensilios para cocina diaria con terminacion mate.',
    price: 54000,
    category: 'Hogar',
    subcategory: 'Cocina',
    attributes: [
      { name: 'Piezas', value: '5 piezas' },
      { name: 'Material', value: 'Resistente' },
      { name: 'Limpieza', value: 'Apto lavavajillas' }
    ],
    image: 'assets/products/kitchen.svg',
    images: ['assets/products/kitchen.svg', 'assets/products/lamp.svg'],
    stock: 0,
    featured: false,
    features: ['5 piezas', 'Mangos ergonomicos', 'Apto lavavajillas', 'Material resistente']
  },
  {
    id: 7,
    name: 'Smartwatch Fit',
    description: 'Reloj inteligente con monitoreo de actividad y notificaciones.',
    price: 139000,
    taxPercentage: 21,
    taxLabel: 'IVA',
    category: 'Tecnologia',
    subcategory: 'Wearables',
    attributes: [
      { name: 'Pantalla', value: 'AMOLED' },
      { name: 'Conectividad', value: 'GPS' },
      { name: 'Resistencia', value: 'Agua' }
    ],
    image: 'assets/products/watch.svg',
    images: ['assets/products/watch.svg', 'assets/products/headphones.svg'],
    stock: 10,
    featured: true,
    features: ['Pantalla AMOLED', 'Medicion cardiaca', 'GPS integrado', 'Resistencia al agua']
  },
  {
    id: 8,
    name: 'Zapatillas Flow',
    description: 'Zapatillas urbanas comodas para caminar y uso diario.',
    price: 92000,
    category: 'Indumentaria',
    subcategory: 'Calzado',
    attributes: [
      { name: 'Tipo', value: 'Urbano' },
      { name: 'Material', value: 'Textil' },
      { name: 'Suela', value: 'Liviana' }
    ],
    image: 'assets/products/shoes.svg',
    images: ['assets/products/shoes.svg', 'assets/products/cap.svg'],
    stock: 13,
    variants: [
      { id: 'shoes-blanco-40', options: { Color: 'Blanco', Talle: '40' }, stock: 3 },
      { id: 'shoes-blanco-41', options: { Color: 'Blanco', Talle: '41' }, stock: 2 },
      { id: 'shoes-negro-40', options: { Color: 'Negro', Talle: '40' }, stock: 4 },
      { id: 'shoes-negro-42', options: { Color: 'Negro', Talle: '42' }, stock: 4 }
    ],
    featured: false,
    features: ['Suela liviana', 'Plantilla acolchada', 'Material textil', 'Diseño urbano']
  },
  {
    id: 9,
    name: 'Organizador Modular',
    description: 'Organizador de escritorio para ordenar accesorios y documentos pequenos.',
    price: 31000,
    category: 'Hogar',
    subcategory: 'Organizacion',
    attributes: [
      { name: 'Compartimentos', value: '3' },
      { name: 'Uso', value: 'Escritorio' },
      { name: 'Terminacion', value: 'Mate' }
    ],
    image: 'assets/products/organizer.svg',
    images: ['assets/products/organizer.svg', 'assets/products/notebook.svg'],
    stock: 20,
    featured: false,
    features: ['3 compartimentos', 'Terminacion mate', 'Base estable', 'Facil limpieza']
  },
  {
    id: 10,
    name: 'Gorra Classic',
    description: 'Gorra de algodon con ajuste trasero y visera curva.',
    price: 26000,
    category: 'Indumentaria',
    subcategory: 'Gorras',
    attributes: [
      { name: 'Material', value: 'Algodon' },
      { name: 'Ajuste', value: 'Regulable' },
      { name: 'Visera', value: 'Curva' }
    ],
    image: 'assets/products/cap.svg',
    images: ['assets/products/cap.svg', 'assets/products/jacket.svg'],
    stock: 17,
    variants: [
      { id: 'cap-azul-unico', options: { Color: 'Azul', Talle: 'Unico' }, stock: 7 },
      { id: 'cap-negro-unico', options: { Color: 'Negro', Talle: 'Unico' }, stock: 6 },
      { id: 'cap-verde-unico', options: { Color: 'Verde', Talle: 'Unico' }, stock: 4 }
    ],
    featured: false,
    features: ['Algodon respirable', 'Ajuste regulable', 'Visera curva', 'Costuras reforzadas']
  },
  {
    id: 11,
    name: 'Cable USB-C Pro',
    description: 'Cable reforzado para carga rapida y transferencia de datos.',
    price: 18000,
    discountPercentage: 20,
    taxPercentage: 21,
    taxLabel: 'IVA',
    category: 'Accesorios',
    subcategory: 'Cables',
    attributes: [
      { name: 'Largo', value: '1.8 metros' },
      { name: 'Carga', value: 'Rapida' },
      { name: 'Conexion', value: 'USB-C' }
    ],
    image: 'assets/products/cable.svg',
    images: ['assets/products/cable.svg', 'assets/products/headphones.svg'],
    stock: 30,
    featured: false,
    features: ['1.8 metros', 'Carga rapida', 'Malla reforzada', 'Conectores metalicos']
  },
  {
    id: 12,
    name: 'Botella Termica',
    description: 'Botella de acero inoxidable para conservar bebidas frias o calientes.',
    price: 39000,
    category: 'Accesorios',
    subcategory: 'Botellas',
    attributes: [
      { name: 'Capacidad', value: '750 ml' },
      { name: 'Material', value: 'Acero inoxidable' },
      { name: 'Aislamiento', value: 'Doble pared' }
    ],
    image: 'assets/products/bottle.svg',
    images: ['assets/products/bottle.svg', 'assets/products/backpack.svg'],
    stock: 14,
    featured: true,
    features: ['750 ml', 'Acero inoxidable', 'Tapa hermetica', 'Doble pared']
  }
];
