const express = require("express");
const path = require("path");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URL = process.env.MONGO_URL || "mongodb+srv://gavecleam:HF8sGunBlFenJNAa@cluster0.56hforp.mongodb.net/gaveclean?retryWrites=true&w=majority&appName=Cluster0";

let db;

async function connectDB() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  db = client.db("gaveclean");
  console.log("✅ Conectado a MongoDB Atlas");

  // Si inventario está vacío, sembrar datos iniciales
  const inv = await db.collection("inventario").countDocuments();
  if (inv === 0) {
    await db.collection("inventario").insertMany(INVENTARIO_INICIAL);
    console.log("📦 Inventario inicial sembrado");
  }
  const prod = await db.collection("products").countDocuments();
  if (prod === 0) {
    await db.collection("products").insertMany(PRODUCTS_INICIAL);
    console.log("📦 Productos iniciales sembrados");
  }
}

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

function normalizarNombre(descripcionBoleta) {
  const upper = descripcionBoleta.toUpperCase();
  for (const m of NOMBRE_MAP) {
    if (m.boleta.some(b => upper.includes(b.toUpperCase()))) return m.inv;
  }
  return descripcionBoleta.charAt(0).toUpperCase() + descripcionBoleta.slice(1).toLowerCase();
}

const INVENTARIO_INICIAL = [{"id":1775796888324,"n":"Lauril Ether Sulfato de Sodium 70%","insumo":"Lauril Ether Sulfato de Sodium 70%","u":"kg","unidad":"kg","stock":20,"pg":9.2834,"prov":"DL & SON E.I.R.L."},{"id":1775796888333,"n":"Betaína","insumo":"Betaína","u":"kg","unidad":"kg","stock":2,"pg":6.5961,"prov":"DL & SON E.I.R.L."},{"id":1775796888345,"n":"Coperland KD - Dietanolamina Coco","insumo":"Coperland KD - Dietanolamina Coco","u":"kg","unidad":"kg","stock":2,"pg":12.3546,"prov":"DL & SON E.I.R.L."},{"id":1775796888355,"n":"EDTA Tetrasódico","insumo":"EDTA Tetrasódico","u":"kg","unidad":"kg","stock":2,"pg":16.6124,"prov":"DL & SON E.I.R.L."},{"id":1775796888364,"n":"Glicerina USP","insumo":"Glicerina USP","u":"kg","unidad":"kg","stock":2,"pg":7.678,"prov":"DL & SON E.I.R.L."},{"id":1775796889167,"n":"Trietanolamina 100%","insumo":"Trietanolamina 100%","u":"kg","unidad":"kg","stock":2,"pg":19.195,"prov":"DL & SON E.I.R.L."},{"id":1775796889194,"n":"Ácido Sulfónico Lineal","insumo":"Ácido Sulfónico Lineal","u":"kg","unidad":"kg","stock":4,"pg":11.517,"prov":"DL & SON E.I.R.L."},{"id":1775796889219,"n":"Hipoclorito 8%","insumo":"Hipoclorito 8%","u":"kg","unidad":"kg","stock":1,"pg":1.5705,"prov":"DL & SON E.I.R.L."},{"id":1775796889260,"n":"Sal - Cloruro de Sodio","insumo":"Sal - Cloruro de Sodio","u":"kg","unidad":"kg","stock":1,"pg":1.745,"prov":"DL & SON E.I.R.L."},{"id":1775796889274,"n":"Fragancia Floral Clásico","insumo":"Fragancia Floral Clásico","u":"kg","unidad":"kg","stock":0.75,"pg":98.8368,"prov":"DL & SON E.I.R.L."},{"id":1775796889289,"n":"Fragancia Lavanda","insumo":"Fragancia Lavanda","u":"kg","unidad":"kg","stock":0.75,"pg":88.9601,"prov":"DL & SON E.I.R.L."},{"id":1775796889302,"n":"Fragancia Baby Intense","insumo":"Fragancia Baby Intense","u":"kg","unidad":"kg","stock":0.25,"pg":74.1276,"prov":"DL & SON E.I.R.L."},{"id":1775796889315,"n":"Fragancia Primaveral Perú","insumo":"Fragancia Primaveral Perú","u":"kg","unidad":"kg","stock":0.25,"pg":82.364,"prov":"DL & SON E.I.R.L."},{"id":1775796889336,"n":"Fragancia Limón Fresco","insumo":"Fragancia Limón Fresco","u":"kg","unidad":"kg","stock":0.75,"pg":104.351,"prov":"DL & SON E.I.R.L."},{"id":1775796889358,"n":"Fragancia Manzana","insumo":"Fragancia Manzana","u":"kg","unidad":"kg","stock":0.25,"pg":90.6004,"prov":"DL & SON E.I.R.L."},{"id":1775796889387,"n":"Fragancia Brisa Marina","insumo":"Fragancia Brisa Marina","u":"kg","unidad":"kg","stock":0.25,"pg":74.1276,"prov":"DL & SON E.I.R.L."},{"id":1775796889407,"n":"Fragancia Dove Plus","insumo":"Fragancia Dove Plus","u":"kg","unidad":"kg","stock":0.5,"pg":108.7135,"prov":"DL & SON E.I.R.L."},{"id":1775796889417,"n":"Colorante Verde","insumo":"Colorante Verde","u":"kg","unidad":"kg","stock":0.1,"pg":144.137,"prov":"DL & SON E.I.R.L."},{"id":1775796889426,"n":"Colorante Azul","insumo":"Colorante Azul","u":"kg","unidad":"kg","stock":0.1,"pg":144.137,"prov":"DL & SON E.I.R.L."},{"id":1775796889440,"n":"Colorante Rojo","insumo":"Colorante Rojo","u":"kg","unidad":"kg","stock":0.1,"pg":144.137,"prov":"DL & SON E.I.R.L."},{"id":1775796889447,"n":"Colorante Amarillo","insumo":"Colorante Amarillo","u":"kg","unidad":"kg","stock":0.1,"pg":144.137,"prov":"DL & SON E.I.R.L."},{"id":1775796889458,"n":"Potasa Cáustica 90%","insumo":"Potasa Cáustica 90%","u":"kg","unidad":"kg","stock":2,"pg":9.074,"prov":"DL & SON E.I.R.L."},{"id":1775796889464,"n":"Preservante - Biocida","insumo":"Preservante - Biocida","u":"u","unidad":"u","stock":2,"pg":12.9479,"prov":"DL & SON E.I.R.L."},{"id":1775796889470,"n":"Nonil Fenol 10 Moles - NP10","insumo":"Nonil Fenol 10 Moles - NP10","u":"kg","unidad":"kg","stock":3,"pg":13.262,"prov":"DL & SON E.I.R.L."},{"id":1775796889477,"n":"Carbopol 940","insumo":"Carbopol 940","u":"kg","unidad":"kg","stock":1,"pg":64.565,"prov":"DL & SON E.I.R.L."},{"id":1775796889483,"n":"Cloruro de Cetrimonio Quartamin 60","insumo":"Cloruro de Cetrimonio Quartamin 60","u":"kg","unidad":"kg","stock":1,"pg":16.403,"prov":"DL & SON E.I.R.L."},{"id":1775796889488,"n":"Ácido Cítrico","insumo":"Ácido Cítrico","u":"kg","unidad":"kg","stock":1,"pg":6.8055,"prov":"DL & SON E.I.R.L."},{"id":1775796889495,"n":"CMC Tixotrol","insumo":"CMC Tixotrol","u":"u","unidad":"u","stock":1,"pg":27.92,"prov":"DL & SON E.I.R.L."},{"id":1775796889500,"n":"Óxido de Amina","insumo":"Óxido de Amina","u":"kg","unidad":"kg","stock":1,"pg":12.9479,"prov":"DL & SON E.I.R.L."},{"id":1775796889505,"n":"Propilenglicol","insumo":"Propilenglicol","u":"u","unidad":"u","stock":1,"pg":13.1922,"prov":"DL & SON E.I.R.L."},{"id":1775796889511,"n":"Hipoclorito de Sodio","insumo":"Hipoclorito de Sodio","u":"lt","unidad":"lt","stock":20,"pg":1.3,"prov":"VELQUIMICOS S.A.C."},{"id":1775796889516,"n":"Bidón","insumo":"Bidón","u":"u","unidad":"u","stock":1,"pg":6.999,"prov":"VELQUIMICOS S.A.C."},{"id":1775796889521,"n":"Ácido Sulfónico","insumo":"Ácido Sulfónico","u":"kg","unidad":"kg","stock":2,"pg":13,"prov":"VELQUIMICOS S.A.C."},{"id":1775796889526,"n":"Butil Glicol","insumo":"Butil Glicol","u":"kg","unidad":"kg","stock":2,"pg":14.998,"prov":"VELQUIMICOS S.A.C."},{"id":1775796889530,"n":"Alcohol Isopropílico","insumo":"Alcohol Isopropílico","u":"lt","unidad":"lt","stock":2,"pg":7.493,"prov":"VELQUIMICOS S.A.C."},{"id":1775796889536,"n":"Silicona 60","insumo":"Silicona 60","u":"kg","unidad":"kg","stock":1,"pg":16.992,"prov":"VELQUIMICOS S.A.C."},{"id":1775796889543,"n":"Nacarante","insumo":"Nacarante","u":"kg","unidad":"kg","stock":1,"pg":25,"prov":"DUO KLEEN S.A.C."},{"id":1775796889549,"n":"Cloruro de Benzalconio","insumo":"Cloruro de Benzalconio","u":"kg","unidad":"kg","stock":2,"pg":25,"prov":"DUO KLEEN S.A.C."},{"id":1775796889555,"n":"Envase PET Gatillo 650ml","insumo":"Envase PET Gatillo 650ml","u":"u","unidad":"u","stock":100,"pg":0.77,"prov":"TRESCOPERU S.A.C.","env":true},{"id":1775796889560,"n":"Tapa Gatillo Blanco B28/410","insumo":"Tapa Gatillo Blanco B28/410","u":"u","unidad":"u","stock":100,"pg":0.72,"prov":"TRESCOPERU S.A.C.","env":true},{"id":1775796889569,"n":"Envase PET Multiuso 1000ml","insumo":"Envase PET Multiuso 1000ml","u":"u","unidad":"u","stock":100,"pg":0.81,"prov":"TRESCOPERU S.A.C.","env":true},{"id":1775796889576,"n":"Tapa Polipropileno Rosca Larga","insumo":"Tapa Polipropileno Rosca Larga","u":"u","unidad":"u","stock":100,"pg":0.072,"prov":"TRESCOPERU S.A.C.","env":true},{"id":1775796889582,"n":"Botella Gave 1000ml","insumo":"Botella Gave 1000ml","u":"u","unidad":"u","stock":100,"pg":0.4,"prov":"GAVE - Propio","env":true},{"id":1775796889587,"n":"Blanqueador Óptico BY3B","insumo":"Blanqueador Óptico BY3B","u":"kg","unidad":"kg","stock":2,"pg":23.73,"prov":"R&K SRL"},{"id":1775796889592,"n":"Aceite Pino 85%","insumo":"Aceite Pino 85%","u":"kg","unidad":"kg","stock":2,"pg":42.375,"prov":"R&K SRL"},{"id":1775796889597,"n":"Perlante en Frío (Laurion PK)","insumo":"Perlante en Frío (Laurion PK)","u":"kg","unidad":"kg","stock":2,"pg":23.73,"prov":"R&K SRL"},{"id":1775796889603,"n":"Alcohol Cetílico (Vegarol 1698)","insumo":"Alcohol Cetílico (Vegarol 1698)","u":"kg","unidad":"kg","stock":1,"pg":16.95,"prov":"R&K SRL"},{"id":1775796889609,"n":"Deyquart-A (Cloruro Cetrimonio 40%)","insumo":"Deyquart-A (Cloruro Cetrimonio 40%)","u":"kg","unidad":"kg","stock":1,"pg":15.25,"prov":"R&K SRL"},{"id":1775796889614,"n":"Antifoam TP200 (Antiespumante)","insumo":"Antifoam TP200 (Antiespumante)","u":"kg","unidad":"kg","stock":1,"pg":29.66,"prov":"R&K SRL"},{"id":1775796889618,"n":"Betaína Espumante (Aurobet C-TP200)","insumo":"Betaína Espumante (Aurobet C-TP200)","u":"kg","unidad":"kg","stock":1,"pg":10.17,"prov":"R&K SRL"},{"id":1775796889623,"n":"Cocamide DEA (Coperlam)","insumo":"Cocamide DEA (Coperlam)","u":"kg","unidad":"kg","stock":1,"pg":15.25,"prov":"R&K SRL"},{"id":1775796889628,"n":"Colorante Amarillo Piranine","insumo":"Colorante Amarillo Piranine","u":"kg","unidad":"kg","stock":0.1,"pg":211.9,"prov":"R&K SRL"}];

const PRODUCTS_INICIAL = [{"id":1,"name":"Detergente","brand":"GaveClean","stock":20,"emoji":"🧴","customLiters":1,"lt":1,"ings":[{"sid":1775796888324,"c":0.056,"u":"g"}],"pv":0},{"id":2,"name":"Lavavajilla","brand":"GaveClean","stock":20,"emoji":"🧽","customLiters":2,"lt":2,"ings":[],"pv":0},{"id":3,"name":"Limpia Todo","brand":"GaveClean","stock":0,"emoji":"🧹","customLiters":2,"lt":2,"ings":[],"pv":0},{"id":5,"name":"Jabón Liquido","brand":"GaveClean","stock":0,"emoji":"🫧","customLiters":2,"lt":2,"ings":[],"pv":0},{"id":6,"name":"Lejía","brand":"GaveClean","stock":20,"emoji":"🧼","customLiters":2,"lt":2,"ings":[],"pv":0}];

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "dist")));

// ── PRODUCTOS ────────────────────────────────────────────────
app.get("/api/products", async (req, res) => {
  try {
    const data = await db.collection("products").find({}).toArray();
    console.log(`[GET /api/products] Encontrados: ${data.length} documentos`);
    const result = data.map(d => {
      const item = { ...d };
      if (!item.id) item.id = d._id.toString();
      delete item._id;
      return item;
    });
    res.json(result);
  } catch (err) {
    console.error("[GET /api/products] Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/products", async (req, res) => {
  const item = { id: Date.now(), customLiters: 2, stock: 0, ings: [], ...req.body };
  await db.collection("products").insertOne(item);
  res.json(item);
});

app.put("/api/products/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.collection("products").updateOne({ id }, { $set: req.body });
  res.json({ ok: true });
});

app.delete("/api/products/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.collection("products").deleteOne({ id });
  res.json({ ok: true });
});

// ── INVENTARIO ───────────────────────────────────────────────
app.get("/api/inventario", async (req, res) => {
  try {
    const data = await db.collection("inventario").find({}).toArray();
    console.log(`[GET /api/inventario] Encontrados: ${data.length} documentos`);
    const result = data.map(d => {
      const item = { ...d };
      if (!item.id) item.id = d._id.toString();
      delete item._id;
      return item;
    });
    res.json(result);
  } catch (err) {
    console.error("[GET /api/inventario] Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/inventario", async (req, res) => {
  const item = { id: Date.now(), ...req.body };
  await db.collection("inventario").insertOne(item);
  res.json(item);
});

app.put("/api/inventario/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.collection("inventario").updateOne({ id }, { $set: req.body });
  res.json({ ok: true });
});

app.delete("/api/inventario/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.collection("inventario").deleteOne({ id });
  res.json({ ok: true });
});

// ── IMPORTAR PDF ─────────────────────────────────────────────
app.post("/api/inventario/importar", async (req, res) => {
  const { items } = req.body;
  const inv = await db.collection("inventario").find({}).toArray();
  const resultado = { actualizados: [], nuevos: [], items_procesados: 0 };

  for (const item of items) {
    const nombreNorm = normalizarNombre(item.descripcion);
    const unidadNorm = item.unidad === "KILOGRAMOS" ? "kg" : item.unidad === "LITROS" ? "L" : item.unidad || "kg";
    const cantidad = parseFloat(item.cantidad) || 0;
    const existeIdx = inv.findIndex(i => i.insumo.toLowerCase() === nombreNorm.toLowerCase());

    if (existeIdx >= 0) {
      const nuevoStock = Math.round((inv[existeIdx].stock + cantidad) * 1000) / 1000;
      await db.collection("inventario").updateOne({ id: inv[existeIdx].id }, { $set: { stock: nuevoStock } });
      resultado.actualizados.push({ insumo: inv[existeIdx].insumo, agregado: cantidad, total: nuevoStock });
    } else {
      const newItem = { id: Date.now() + Math.random(), insumo: nombreNorm, stock: cantidad, unidad: unidadNorm };
      await db.collection("inventario").insertOne(newItem);
      resultado.nuevos.push({ insumo: nombreNorm, stock: cantidad });
    }
    resultado.items_procesados++;
  }

  const invFinal = await db.collection("inventario").find({}).toArray();
  res.json({ ok: true, inventario: invFinal, resultado });
});

// ── VENTAS ───────────────────────────────────────────────────
app.get("/api/ventas", async (req, res) => {
  try {
    const data = await db.collection("ventas").find({}).toArray();
    const result = data.map(d => {
      const item = { ...d };
      if (!item.id) item.id = d._id.toString();
      delete item._id;
      return item;
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/ventas", async (req, res) => {
  const item = { id: Date.now(), ...req.body };
  await db.collection("ventas").insertOne(item);
  res.json(item);
});

app.delete("/api/ventas/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.collection("ventas").deleteOne({ id });
  res.json({ ok: true });
});

// ── STOCK DE PRODUCTOS ──────────────────────────────────────
app.get("/api/stock", async (req, res) => {
  try {
    const data = await db.collection("stock").find({}).toArray();
    res.json(data.map(d => { const i={...d}; if(!i.id)i.id=d._id.toString(); delete i._id; return i; }));
  } catch(err) { res.status(500).json({ error: err.message }); }
});

app.post("/api/stock", async (req, res) => {
  try {
    const item = { id: Date.now(), ...req.body };
    await db.collection("stock").insertOne(item);
    res.json(item);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

app.put("/api/stock/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.collection("stock").updateOne({ id }, { $set: req.body });
    res.json({ ok: true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

app.delete("/api/stock/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.collection("stock").deleteOne({ id });
    res.json({ ok: true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// ── Fallback React ───────────────────────────────────────────
// ⚠️ SIEMPRE debe ir AL FINAL, después de todas las rutas /api
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ── INICIAR ──────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ GaveClean corriendo en puerto ${PORT}`);
  });
}).catch(err => {
  console.error("❌ Error conectando a MongoDB:", err);
  process.exit(1);
});
