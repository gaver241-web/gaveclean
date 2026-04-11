const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
console.log("DATA_DIR:", DATA_DIR);
console.log("Archivos:", fs.existsSync(DATA_DIR) ? fs.readdirSync(DATA_DIR) : "vacio");

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
  products: [{"id":1,"name":"Detergente","brand":"GaveClean","stock":20,"emoji":"🧴","customLiters":1,"formula":[{"insumo":"Lauril Ether Sulfato de Sodio 70%","cantidad":15,"unidad":"%"},{"insumo":"Betaína","cantidad":3,"unidad":"%"},{"insumo":"Cloruro de Sodio","cantidad":1.5,"unidad":"%"},{"insumo":"Agua","cantidad":79.5,"unidad":"%"},{"insumo":"Fragancia","cantidad":1,"unidad":"%"}],"lt":1,"ings":[{"sid":1775796888324,"c":0.056,"u":"g"}],"pv":0},{"id":2,"name":"Lavavajilla","brand":"GaveClean","stock":20,"emoji":"🧽","customLiters":2,"formula":[{"insumo":"Lauril Ether Sulfato de Sodio 70%","cantidad":12,"unidad":"%"},{"insumo":"Dietanolamida de coco","cantidad":3,"unidad":"%"},{"insumo":"Sal industrial","cantidad":1,"unidad":"%"},{"insumo":"Agua","cantidad":83,"unidad":"%"},{"insumo":"Colorante","cantidad":1,"unidad":"%"}]},{"id":3,"name":"Limpia Todo","brand":"GaveClean","stock":0,"emoji":"🧹","customLiters":2,"formula":[{"insumo":"EDTA tetrasódico","cantidad":0.5,"unidad":"%"},{"insumo":"Surfactante no iónico","cantidad":2,"unidad":"%"},{"insumo":"Alcohol isopropílico","cantidad":5,"unidad":"%"},{"insumo":"Agua","cantidad":92.5,"unidad":"%"}]},{"id":5,"name":"Jabón Liquido","brand":"GaveClean","stock":0,"emoji":"🫧","customLiters":2,"formula":[{"insumo":"Lauril Ether Sulfato de Sodio 70%","cantidad":10,"unidad":"%"},{"insumo":"Glicerina USP","cantidad":3,"unidad":"%"},{"insumo":"Agua","cantidad":86,"unidad":"%"},{"insumo":"Fragancia","cantidad":1,"unidad":"%"}]},{"id":6,"name":"Lejía","brand":"GaveClean","stock":20,"emoji":"🧼","customLiters":2,"formula":[{"insumo":"Hipoclorito de Sodio 10%","cantidad":50,"unidad":"%"},{"insumo":"Agua","cantidad":49.5,"unidad":"%"},{"insumo":"Hidróxido de Sodio","cantidad":0.5,"unidad":"%"}]}],
  inventario: [{"id":1775796888324,"n":"Lauril Ether Sulfato de Sodium 70%","insumo":"Lauril Ether Sulfato de Sodium 70%","u":"kg","unidad":"kg","stock":20,"pg":9.2834,"prov":"DL & SON E.I.R.L."},{"id":1775796888333,"n":"Betaína","insumo":"Betaína","u":"kg","unidad":"kg","stock":2,"pg":6.5961,"prov":"DL & SON E.I.R.L."},{"id":1775796888345,"n":"Coperland KD - Dietanolamina Coco","insumo":"Coperland KD - Dietanolamina Coco","u":"kg","unidad":"kg","stock":2,"pg":12.3546,"prov":"DL & SON E.I.R.L."},{"id":1775796888355,"n":"EDTA Tetrasódico","insumo":"EDTA Tetrasódico","u":"kg","unidad":"kg","stock":2,"pg":16.6124,"prov":"DL & SON E.I.R.L."},{"id":1775796888364,"n":"Glicerina USP","insumo":"Glicerina USP","u":"kg","unidad":"kg","stock":2,"pg":7.678,"prov":"DL & SON E.I.R.L."},{"id":1775796889167,"n":"Trietanolamina 100%","insumo":"Trietanolamina 100%","u":"kg","unidad":"kg","stock":2,"pg":19.195,"prov":"DL & SON E.I.R.L."},{"id":1775796889194,"n":"Ácido Sulfónico Lineal","insumo":"Ácido Sulfónico Lineal","u":"kg","unidad":"kg","stock":4,"pg":11.517,"prov":"DL & SON E.I.R.L."},{"id":1775796889219,"n":"Hipoclorito 8%","insumo":"Hipoclorito 8%","u":"kg","unidad":"kg","stock":1,"pg":1.5705,"prov":"DL & SON E.I.R.L."},{"id":1775796889260,"n":"Sal - Cloruro de Sodio","insumo":"Sal - Cloruro de Sodio","u":"kg","unidad":"kg","stock":1,"pg":1.745,"prov":"DL & SON E.I.R.L."},{"id":1775796889274,"n":"Fragancia Floral Clásico","insumo":"Fragancia Floral Clásico","u":"kg","unidad":"kg","stock":0.75,"pg":98.8368,"prov":"DL & SON E.I.R.L."},{"id":1775796889289,"n":"Fragancia Lavanda","insumo":"Fragancia Lavanda","u":"kg","unidad":"kg","stock":0.75,"pg":88.9601,"prov":"DL & SON E.I.R.L."},{"id":1775796889302,"n":"Fragancia Baby Intense","insumo":"Fragancia Baby Intense","u":"kg","unidad":"kg","stock":0.25,"pg":74.1276,"prov":"DL & SON E.I.R.L."},{"id":1775796889315,"n":"Fragancia Primaveral Perú","insumo":"Fragancia Primaveral Perú","u":"kg","unidad":"kg","stock":0.25,"pg":82.364,"prov":"DL & SON E.I.R.L."},{"id":1775796889336,"n":"Fragancia Limón Fresco","insumo":"Fragancia Limón Fresco","u":"kg","unidad":"kg","stock":0.75,"pg":104.351,"prov":"DL & SON E.I.R.L."},{"id":1775796889358,"n":"Fragancia Manzana","insumo":"Fragancia Manzana","u":"kg","unidad":"kg","stock":0.25,"pg":90.6004,"prov":"DL & SON E.I.R.L."},{"id":1775796889387,"n":"Fragancia Brisa Marina","insumo":"Fragancia Brisa Marina","u":"kg","unidad":"kg","stock":0.25,"pg":74.1276,"prov":"DL & SON E.I.R.L."},{"id":1775796889407,"n":"Fragancia Dove Plus","insumo":"Fragancia Dove Plus","u":"kg","unidad":"kg","stock":0.5,"pg":108.7135,"prov":"DL & SON E.I.R.L."},{"id":1775796889417,"n":"Colorante Verde","insumo":"Colorante Verde","u":"kg","unidad":"kg","stock":0.1,"pg":144.137,"prov":"DL & SON E.I.R.L."},{"id":1775796889426,"n":"Colorante Azul","insumo":"Colorante Azul","u":"kg","unidad":"kg","stock":0.1,"pg":144.137,"prov":"DL & SON E.I.R.L."},{"id":1775796889440,"n":"Colorante Rojo","insumo":"Colorante Rojo","u":"kg","unidad":"kg","stock":0.1,"pg":144.137,"prov":"DL & SON E.I.R.L."},{"id":1775796889447,"n":"Colorante Amarillo","insumo":"Colorante Amarillo","u":"kg","unidad":"kg","stock":0.1,"pg":144.137,"prov":"DL & SON E.I.R.L."},{"id":1775796889458,"n":"Potasa Cáustica 90%","insumo":"Potasa Cáustica 90%","u":"kg","unidad":"kg","stock":2,"pg":9.074,"prov":"DL & SON E.I.R.L."},{"id":1775796889464,"n":"Preservante - Biocida","insumo":"Preservante - Biocida","u":"u","unidad":"u","stock":2,"pg":12.9479,"prov":"DL & SON E.I.R.L."},{"id":1775796889470,"n":"Nonil Fenol 10 Moles - NP10","insumo":"Nonil Fenol 10 Moles - NP10","u":"kg","unidad":"kg","stock":3,"pg":13.262,"prov":"DL & SON E.I.R.L."},{"id":1775796889477,"n":"Carbopol 940","insumo":"Carbopol 940","u":"kg","unidad":"kg","stock":1,"pg":64.565,"prov":"DL & SON E.I.R.L."},{"id":1775796889483,"n":"Cloruro de Cetrimonio Quartamin 60","insumo":"Cloruro de Cetrimonio Quartamin 60","u":"kg","unidad":"kg","stock":1,"pg":16.403,"prov":"DL & SON E.I.R.L."},{"id":1775796889488,"n":"Ácido Cítrico","insumo":"Ácido Cítrico","u":"kg","unidad":"kg","stock":1,"pg":6.8055,"prov":"DL & SON E.I.R.L."},{"id":1775796889495,"n":"CMC Tixotrol","insumo":"CMC Tixotrol","u":"u","unidad":"u","stock":1,"pg":27.92,"prov":"DL & SON E.I.R.L."},{"id":1775796889500,"n":"Óxido de Amina","insumo":"Óxido de Amina","u":"kg","unidad":"kg","stock":1,"pg":12.9479,"prov":"DL & SON E.I.R.L."},{"id":1775796889505,"n":"Propilenglicol","insumo":"Propilenglicol","u":"u","unidad":"u","stock":1,"pg":13.1922,"prov":"DL & SON E.I.R.L."},{"id":1775796889511,"n":"Hipoclorito de Sodio","insumo":"Hipoclorito de Sodio","u":"lt","unidad":"lt","stock":20,"pg":1.3,"prov":"VELQUIMICOS S.A.C."},{"id":1775796889516,"n":"Bidón","insumo":"Bidón","u":"u","unidad":"u","stock":1,"pg":6.999,"prov":"VELQUIMICOS S.A.C."},{"id":1775796889521,"n":"Ácido Sulfónico","insumo":"Ácido Sulfónico","u":"kg","unidad":"kg","stock":2,"pg":13,"prov":"VELQUIMICOS S.A.C."},{"id":1775796889526,"n":"Butil Glicol","insumo":"Butil Glicol","u":"kg","unidad":"kg","stock":2,"pg":14.998,"prov":"VELQUIMICOS S.A.C."},{"id":1775796889530,"n":"Alcohol Isopropílico","insumo":"Alcohol Isopropílico","u":"lt","unidad":"lt","stock":2,"pg":7.493,"prov":"VELQUIMICOS S.A.C."},{"id":1775796889536,"n":"Silicona 60","insumo":"Silicona 60","u":"kg","unidad":"kg","stock":1,"pg":16.992,"prov":"VELQUIMICOS S.A.C."},{"id":1775796889543,"n":"Nacarante","insumo":"Nacarante","u":"kg","unidad":"kg","stock":1,"pg":25,"prov":"DUO KLEEN S.A.C."},{"id":1775796889549,"n":"Cloruro de Benzalconio","insumo":"Cloruro de Benzalconio","u":"kg","unidad":"kg","stock":2,"pg":25,"prov":"DUO KLEEN S.A.C."},{"id":1775796889555,"n":"Envase PET Gatillo 650ml","insumo":"Envase PET Gatillo 650ml","u":"u","unidad":"u","stock":100,"pg":0.77,"prov":"TRESCOPERU S.A.C.","env":true},{"id":1775796889560,"n":"Tapa Gatillo Blanco B28/410","insumo":"Tapa Gatillo Blanco B28/410","u":"u","unidad":"u","stock":100,"pg":0.72,"prov":"TRESCOPERU S.A.C.","env":true},{"id":1775796889569,"n":"Envase PET Multiuso 1000ml","insumo":"Envase PET Multiuso 1000ml","u":"u","unidad":"u","stock":100,"pg":0.81,"prov":"TRESCOPERU S.A.C.","env":true},{"id":1775796889576,"n":"Tapa Polipropileno Rosca Larga","insumo":"Tapa Polipropileno Rosca Larga","u":"u","unidad":"u","stock":100,"pg":0.072,"prov":"TRESCOPERU S.A.C.","env":true},{"id":1775796889582,"n":"Botella Gave 1000ml","insumo":"Botella Gave 1000ml","u":"u","unidad":"u","stock":100,"pg":0.4,"prov":"GAVE - Propio","env":true},{"id":1775796889587,"n":"Blanqueador Óptico BY3B","insumo":"Blanqueador Óptico BY3B","u":"kg","unidad":"kg","stock":2,"pg":23.73,"prov":"R&K SRL"},{"id":1775796889592,"n":"Aceite Pino 85%","insumo":"Aceite Pino 85%","u":"kg","unidad":"kg","stock":2,"pg":42.375,"prov":"R&K SRL"},{"id":1775796889597,"n":"Perlante en Frío (Laurion PK)","insumo":"Perlante en Frío (Laurion PK)","u":"kg","unidad":"kg","stock":2,"pg":23.73,"prov":"R&K SRL"},{"id":1775796889603,"n":"Alcohol Cetílico (Vegarol 1698)","insumo":"Alcohol Cetílico (Vegarol 1698)","u":"kg","unidad":"kg","stock":1,"pg":16.95,"prov":"R&K SRL"},{"id":1775796889609,"n":"Deyquart-A (Cloruro Cetrimonio 40%)","insumo":"Deyquart-A (Cloruro Cetrimonio 40%)","u":"kg","unidad":"kg","stock":1,"pg":15.25,"prov":"R&K SRL"},{"id":1775796889614,"n":"Antifoam TP200 (Antiespumante)","insumo":"Antifoam TP200 (Antiespumante)","u":"kg","unidad":"kg","stock":1,"pg":29.66,"prov":"R&K SRL"},{"id":1775796889618,"n":"Betaína Espumante (Aurobet C-TP200)","insumo":"Betaína Espumante (Aurobet C-TP200)","u":"kg","unidad":"kg","stock":1,"pg":10.17,"prov":"R&K SRL"},{"id":1775796889623,"n":"Cocamide DEA (Coperlam)","insumo":"Cocamide DEA (Coperlam)","u":"kg","unidad":"kg","stock":1,"pg":15.25,"prov":"R&K SRL"},{"id":1775796889628,"n":"Colorante Amarillo Piranine","insumo":"Colorante Amarillo Piranine","u":"kg","unidad":"kg","stock":0.1,"pg":211.9,"prov":"R&K SRL"}],
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
