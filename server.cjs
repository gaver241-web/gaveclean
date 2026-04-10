const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3001;
const DATA_DIR = path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

// ── Mapa de nombres de boleta → nombre en inventario ────────
// Esto permite que el PDF de DL&SON se empareje con tus insumos
const NOMBRE_MAP = [
  { boleta: ["LAURIL ETHER SULFATO DE SODIUM 70%", "LAURIL ETHER SULFATO DE SODIO 70%"], inv: "Lauril Ether Sulfato de Sodio 70%" },
  { boleta: ["BETAINA", "BETAÍNA"], inv: "Betaína" },
  { boleta: ["COPERLAND KD", "DIETANOLAMINA DE COCO", "DIETANOLAMIDA DE COCO"], inv: "Dietanolamida de coco" },
  { boleta: ["EDTA TETRASODICO", "EDTA TETRASÓDICO"], inv: "EDTA tetrasódico" },
  { boleta: ["GLICERINA - USP", "GLICERINA USP"], inv: "Glicerina USP" },
  { boleta: ["HIPOCLORITO 8%", "HIPOCLORITO DE SODIO", "HIPOCLORITO"], inv: "Hipoclorito de Sodio 10%" },
  { boleta: ["SAL - CLORURO DE SODIO", "CLORURO DE SODIO", "SAL INDUSTRIAL"], inv: "Cloruro de Sodio" },
  { boleta: ["TRIETANOLAMINA 100%", "TRIETANOLAMINA"], inv: "Trietanolamina 100%" },
  { boleta: ["ACIDO SULFONICO LINEAL", "ÁCIDO SULFÓNICO LINEAL"], inv: "Ácido Sulfónico Lineal" },
  { boleta: ["NONIL FENOL 10 MOLES", "NP10"], inv: "Nonil Fenol 10 Moles NP10" },
  { boleta: ["PRESERVANTE - BIOCIDA", "PRESERVANTE", "BIOCIDA"], inv: "Preservante Biocida" },
  { boleta: ["POTASA CAUSTICA 90%", "POTASA CÁUSTICA"], inv: "Potasa Cáustica 90%" },
  { boleta: ["FRAGANCIA FLORAL CLASICO"], inv: "Fragancia Floral Clásico" },
  { boleta: ["FRAGANCIA LAVANDA"], inv: "Fragancia Lavanda" },
  { boleta: ["FRAGANCIA BABY INTENSE"], inv: "Fragancia Baby Intense" },
  { boleta: ["FRAGANCIA PRIMAVERAL PERU"], inv: "Fragancia Primaveral Perú" },
  { boleta: ["FRAGANCIA LIMON FRESCO"], inv: "Fragancia Limón Fresco" },
  { boleta: ["FRAGANCIA MANZANA"], inv: "Fragancia Manzana" },
  { boleta: ["FRAGANCIA BRISA MARINA"], inv: "Fragancia Brisa Marina" },
  { boleta: ["COLORANTE VERDE"], inv: "Colorante Verde" },
  { boleta: ["COLORANTE AZUL"], inv: "Colorante Azul" },
  { boleta: ["COLORANTE ROJO"], inv: "Colorante Rojo" },
  { boleta: ["COLORANTE AMARILLO"], inv: "Colorante Amarillo" },
];

// Convierte nombre de boleta a nombre estándar de inventario
function normalizarNombre(descripcionBoleta) {
  const upper = descripcionBoleta.toUpperCase();
  for (const m of NOMBRE_MAP) {
    if (m.boleta.some(b => upper.includes(b.toUpperCase()))) {
      return m.inv;
    }
  }
  // Si no hay mapeo, capitaliza el nombre original
  return descripcionBoleta.charAt(0).toUpperCase() + descripcionBoleta.slice(1).toLowerCase();
}

const DEFAULTS = {
  products: [
    { id: 1, name: "Detergente", brand: "GaveClean", stock: 20.0, emoji: "🧴", customLiters: 2, formula: [
      { insumo: "Lauril Ether Sulfato de Sodio 70%", cantidad: 15, unidad: "%" },
      { insumo: "Betaína", cantidad: 3, unidad: "%" },
      { insumo: "Cloruro de Sodio", cantidad: 1.5, unidad: "%" },
      { insumo: "Agua", cantidad: 79.5, unidad: "%" },
      { insumo: "Fragancia", cantidad: 1, unidad: "%" },
    ]},
    { id: 2, name: "Lavavajilla", brand: "GaveClean", stock: 0.0, emoji: "🧽", customLiters: 2, formula: [
      { insumo: "Lauril Ether Sulfato de Sodio 70%", cantidad: 12, unidad: "%" },
      { insumo: "Dietanolamida de coco", cantidad: 3, unidad: "%" },
      { insumo: "Sal industrial", cantidad: 1, unidad: "%" },
      { insumo: "Agua", cantidad: 83, unidad: "%" },
      { insumo: "Colorante", cantidad: 1, unidad: "%" },
    ]},
    { id: 3, name: "Limpia Todo", brand: "GaveClean", stock: 0.0, emoji: "🧹", customLiters: 2, formula: [
      { insumo: "EDTA tetrasódico", cantidad: 0.5, unidad: "%" },
      { insumo: "Surfactante no iónico", cantidad: 2, unidad: "%" },
      { insumo: "Alcohol isopropílico", cantidad: 5, unidad: "%" },
      { insumo: "Agua", cantidad: 92.5, unidad: "%" },
    ]},
    { id: 4, name: "Jabón Liquido", brand: "GaveClean", stock: 0.0, emoji: "🫧", customLiters: 2, formula: [
      { insumo: "Lauril Ether Sulfato de Sodio 70%", cantidad: 10, unidad: "%" },
      { insumo: "Glicerina USP", cantidad: 2, unidad: "%" },
      { insumo: "Betaína", cantidad: 2, unidad: "%" },
      { insumo: "Agua", cantidad: 85, unidad: "%" },
      { insumo: "Fragancia", cantidad: 1, unidad: "%" },
    ]},
    { id: 5, name: "Jabón Liquido", brand: "GaveClean", stock: 0.0, emoji: "🫧", customLiters: 2, formula: [
      { insumo: "Lauril Ether Sulfato de Sodio 70%", cantidad: 10, unidad: "%" },
      { insumo: "Glicerina USP", cantidad: 3, unidad: "%" },
      { insumo: "Agua", cantidad: 86, unidad: "%" },
      { insumo: "Fragancia", cantidad: 1, unidad: "%" },
    ]},
    { id: 6, name: "Lejía", brand: "GaveClean", stock: 0.0, emoji: "🧼", customLiters: 2, formula: [
      { insumo: "Hipoclorito de Sodio 10%", cantidad: 50, unidad: "%" },
      { insumo: "Agua", cantidad: 49.5, unidad: "%" },
      { insumo: "Hidróxido de Sodio", cantidad: 0.5, unidad: "%" },
    ]},
    { id: 7, name: "Lejía", brand: "Glave", stock: 0.0, emoji: "🧼", customLiters: 2, formula: [
      { insumo: "Hipoclorito de Sodio 10%", cantidad: 60, unidad: "%" },
      { insumo: "Agua", cantidad: 39.5, unidad: "%" },
      { insumo: "Estabilizante", cantidad: 0.5, unidad: "%" },
    ]},
  ],
  inventario: [
    { id: 1, insumo: "Lauril Ether Sulfato de Sodio 70%", stock: 10.0, unidad: "kg" },
    { id: 2, insumo: "Betaína", stock: 2.0, unidad: "kg" },
    { id: 3, insumo: "Dietanolamida de coco", stock: 2.0, unidad: "kg" },
    { id: 4, insumo: "EDTA tetrasódico", stock: 2.0, unidad: "kg" },
    { id: 5, insumo: "Glicerina USP", stock: 2.0, unidad: "kg" },
    { id: 6, insumo: "Hipoclorito de Sodio 10%", stock: 5.0, unidad: "L" },
    { id: 7, insumo: "Cloruro de Sodio", stock: 3.0, unidad: "kg" },
    { id: 8, insumo: "Trietanolamina 100%", stock: 1.0, unidad: "kg" },
    { id: 9, insumo: "Ácido Sulfónico Lineal", stock: 1.0, unidad: "kg" },
    { id: 10, insumo: "Nonil Fenol 10 Moles NP10", stock: 1.0, unidad: "kg" },
    { id: 11, insumo: "Preservante Biocida", stock: 1.0, unidad: "kg" },
    { id: 12, insumo: "Potasa Cáustica 90%", stock: 2.0, unidad: "kg" },
    { id: 13, insumo: "Fragancia Floral Clásico", stock: 0.25, unidad: "kg" },
    { id: 14, insumo: "Fragancia Lavanda", stock: 0.25, unidad: "kg" },
    { id: 15, insumo: "Fragancia Baby Intense", stock: 0.25, unidad: "kg" },
    { id: 16, insumo: "Fragancia Primaveral Perú", stock: 0.25, unidad: "kg" },
    { id: 17, insumo: "Fragancia Limón Fresco", stock: 0.25, unidad: "kg" },
    { id: 18, insumo: "Fragancia Manzana", stock: 0.25, unidad: "kg" },
    { id: 19, insumo: "Fragancia Brisa Marina", stock: 0.25, unidad: "kg" },
    { id: 20, insumo: "Colorante Verde", stock: 0.1, unidad: "kg" },
    { id: 21, insumo: "Colorante Azul", stock: 0.1, unidad: "kg" },
    { id: 22, insumo: "Colorante Rojo", stock: 0.1, unidad: "kg" },
    { id: 23, insumo: "Colorante Amarillo", stock: 0.1, unidad: "kg" },
  ],
  ventas: [],
};

function readData(name) {
  const file = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(file)) writeData(name, DEFAULTS[name] || []);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeData(name, data) {
  fs.writeFileSync(path.join(DATA_DIR, `${name}.json`), JSON.stringify(data, null, 2), "utf8");
}

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "dist")));

// ── PRODUCTOS ────────────────────────────────────────────────
app.get("/api/products", (req, res) => res.json(readData("products")));

app.post("/api/products", (req, res) => {
  const products = readData("products");
  const newProduct = { id: Date.now(), customLiters: 2, stock: 0, formula: [], ...req.body };
  products.push(newProduct);
  writeData("products", products);
  res.json(newProduct);
});

app.put("/api/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let products = readData("products");
  products = products.map(p => p.id === id ? { ...p, ...req.body } : p);
  writeData("products", products);
  res.json({ ok: true });
});

app.delete("/api/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let products = readData("products");
  products = products.filter(p => p.id !== id);
  writeData("products", products);
  res.json({ ok: true });
});

// ── INVENTARIO ───────────────────────────────────────────────
app.get("/api/inventario", (req, res) => res.json(readData("inventario")));

app.post("/api/inventario", (req, res) => {
  const inv = readData("inventario");
  const newItem = { id: Date.now(), ...req.body };
  inv.push(newItem);
  writeData("inventario", inv);
  res.json(newItem);
});

app.put("/api/inventario/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let inv = readData("inventario");
  inv = inv.map(i => i.id === id ? { ...i, ...req.body } : i);
  writeData("inventario", inv);
  res.json({ ok: true });
});

app.delete("/api/inventario/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let inv = readData("inventario");
  inv = inv.filter(i => i.id !== id);
  writeData("inventario", inv);
  res.json({ ok: true });
});

// ── IMPORTAR PDF (procesamiento de items de boleta) ──────────
// Recibe lista de items de la boleta extraídos en el frontend
// Suma al stock si existe, crea nuevo si no existe
app.post("/api/inventario/importar", (req, res) => {
  const { items } = req.body; // [{ descripcion, cantidad, unidad }]
  let inv = readData("inventario");
  const resultado = { actualizados: [], nuevos: [], items_procesados: 0 };

  for (const item of items) {
    const nombreNorm = normalizarNombre(item.descripcion);
    const unidadNorm = item.unidad === "KILOGRAMOS" ? "kg" : item.unidad === "LITROS" ? "L" : item.unidad || "kg";
    const cantidad = parseFloat(item.cantidad) || 0;

    // Buscar si ya existe (comparación insensible a mayúsculas)
    const existeIdx = inv.findIndex(i => i.insumo.toLowerCase() === nombreNorm.toLowerCase());

    if (existeIdx >= 0) {
      // Sumar al stock existente
      inv[existeIdx].stock = Math.round((inv[existeIdx].stock + cantidad) * 1000) / 1000;
      resultado.actualizados.push({ insumo: inv[existeIdx].insumo, agregado: cantidad, total: inv[existeIdx].stock });
    } else {
      // Crear nuevo insumo
      const newItem = { id: Date.now() + Math.random(), insumo: nombreNorm, stock: cantidad, unidad: unidadNorm };
      inv.push(newItem);
      resultado.nuevos.push({ insumo: nombreNorm, stock: cantidad });
    }
    resultado.items_procesados++;
  }

  writeData("inventario", inv);
  res.json({ ok: true, inventario: inv, resultado });
});

// ── VENTAS ───────────────────────────────────────────────────
app.get("/api/ventas", (req, res) => res.json(readData("ventas")));

app.post("/api/ventas", (req, res) => {
  const ventas = readData("ventas");
  const newVenta = { id: Date.now(), ...req.body };
  ventas.push(newVenta);
  writeData("ventas", ventas);
  res.json(newVenta);
});

app.delete("/api/ventas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let ventas = readData("ventas");
  ventas = ventas.filter(v => v.id !== id);
  writeData("ventas", ventas);
  res.json({ ok: true });
});

// ── Fallback React ───────────────────────────────────────────
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("\n✅ ============================================");
  console.log(`   GaveClean servidor corriendo en puerto ${PORT}`);
  console.log(`   PC:     http://localhost:${PORT}`);
  console.log(`   Tablet: http://TU_IP:${PORT}  (ejecuta ipconfig)`);
  console.log("===============================================\n");
});
