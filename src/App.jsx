import { useState, useEffect, useCallback, useRef } from "react";

const API = import.meta.env.DEV ? `http://${window.location.hostname}:3001/api` : "/api";
const apiFetch = {
  get: (p) => fetch(`${API}${p}`).then(r => r.json()),
  post: (p, b) => fetch(`${API}${p}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) }).then(r => r.json()),
  put: (p, b) => fetch(`${API}${p}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) }).then(r => r.json()),
  del: (p) => fetch(`${API}${p}`, { method: "DELETE" }).then(r => r.json()),
};

const CL = {
  blue:   { bg: "#e3f0ff", t: "#1565c0" },
  green:  { bg: "#e8f7ef", t: "#1b7a4a" },
  teal:   { bg: "#e0f5f5", t: "#0d7377" },
  purple: { bg: "#f3e8ff", t: "#6b21a8" },
  amber:  { bg: "#fef3e2", t: "#b45309" },
  red:    { bg: "#fdf0ef", t: "#c0392b" },
};

const PROVEEDORES_INICIALES = [
  { id: "prov1", nombre: "DL & SON E.I.R.L.", ruc: "20608323911", direccion: "Bl. W2 Nro. 165 Res. Campoy, San Juan de Lurigancho, Lima", telefono: "", email: "", tipo: "Insumos químicos industriales" },
  { id: "prov2", nombre: "VELQUIMICOS S.A.C.", ruc: "20614307014", direccion: "Av. 25 de Enero Mza. B Lote 1, San Martín de Porres, Lima", telefono: "", email: "", tipo: "Insumos químicos para limpieza" },
  { id: "prov3", nombre: "DUO KLEEN S.A.C.", ruc: "20606107383", direccion: "Mz. A Lt. 8 4to Sector Nuevo Progreso V.M.T., Lima", telefono: "979382133 / 975884995", email: "duokleen@gmail.com", tipo: "Insumos químicos y desinfectantes" },
  { id: "prov4", nombre: "TRESCOPERU S.A.C.", ruc: "20614467461", direccion: "Urb. Santa Ana, Av. 2 de Octubre Mz. D-2 Lt. 7, Los Olivos, Lima", telefono: "923150204", email: "trescoperu@gmail.com", tipo: "Envases PET y PEAD para industria" },
  { id: "prov5", nombre: "CLAVES INDUSTRIALES R&K SRL", ruc: "20606418770", direccion: "Cal. Leoncio Prado 443 Chiclayo, Lambayeque", telefono: "955517913 / 933273694 / 074-271096", email: "ventaschiclayo@grupoindustrialryk.com", tipo: "Insumos químicos industriales" },
  { id: "prov6", nombre: "GAVE - Propio", ruc: "—", direccion: "Chepén, La Libertad", telefono: "", email: "", tipo: "Envases para productos Gave" },
];

const COMPRAS_INICIALES = [
  { id:"c1", proveedor:"VELQUIMICOS S.A.C.", provId:"prov2", nBoleta:"EB01-10", fecha:"2026-03-19", moneda:"PEN", montoOriginal:120.97, tc:3.49, items:[{descripcion:"Hipoclorito de Sodio",cantidad:20,unidad:"lt",precioUnit:1.30},{descripcion:"Bidón",cantidad:1,unidad:"u",precioUnit:6.999},{descripcion:"Ácido Sulfónico",cantidad:2,unidad:"kg",precioUnit:13.00},{descripcion:"Butil Glicol",cantidad:2,unidad:"kg",precioUnit:14.998},{descripcion:"Alcohol Isopropílico",cantidad:2,unidad:"lt",precioUnit:7.493},{descripcion:"Silicona 60",cantidad:1,unidad:"kg",precioUnit:16.992}]},
  { id:"c2", proveedor:"DUO KLEEN S.A.C.", provId:"prov3", nBoleta:"B001-265", fecha:"2026-03-18", moneda:"PEN", montoOriginal:80.00, tc:3.49, items:[{descripcion:"Nacarante 1K",cantidad:1,unidad:"kg",precioUnit:25.00},{descripcion:"Cloruro de Benzalconio",cantidad:2,unidad:"kg",precioUnit:25.00}]},
  { id:"c3", proveedor:"DL & SON E.I.R.L.", provId:"prov1", nBoleta:"B002-00000065", fecha:"2026-02-04", moneda:"USD", montoOriginal:100.14, tc:3.49, items:[{descripcion:"Lauril Ether Sulfato de Sodium 70%",cantidad:5,unidad:"kg",precioUnit:2.66},{descripcion:"Betaína",cantidad:1,unidad:"kg",precioUnit:1.89},{descripcion:"EDTA Tetrasódico",cantidad:1,unidad:"kg",precioUnit:4.76},{descripcion:"Glicerina USP",cantidad:1,unidad:"kg",precioUnit:2.20},{descripcion:"Fragancia Floral Clásico",cantidad:0.250,unidad:"kg",precioUnit:23.60},{descripcion:"Fragancia Lavanda",cantidad:0.250,unidad:"kg",precioUnit:21.24},{descripcion:"Colorante Verde",cantidad:0.100,unidad:"kg",precioUnit:41.30},{descripcion:"Potasa Cáustica 90%",cantidad:2,unidad:"kg",precioUnit:2.60},{descripcion:"Preservante - Biocida",cantidad:1,unidad:"u",precioUnit:3.71}]},
  { id:"c4", proveedor:"DL & SON E.I.R.L.", provId:"prov1", nBoleta:"B002-00000087", fecha:"2026-02-25", moneda:"USD", montoOriginal:41.45, tc:3.49, items:[{descripcion:"Nonil Fenol 10 Moles - NP10",cantidad:1,unidad:"kg",precioUnit:3.80},{descripcion:"Preservante - Biocida",cantidad:1,unidad:"u",precioUnit:3.71}]},
  { id:"c5", proveedor:"TRESCOPERU S.A.C.", provId:"prov4", nBoleta:"B001-00000083", fecha:"2026-03-09", moneda:"PEN", montoOriginal:237.20, tc:3.49, items:[{descripcion:"Envase PET Gatillo 650 ml",cantidad:100,unidad:"u",precioUnit:0.77},{descripcion:"Envase PET Multiuso 1000 ml",cantidad:100,unidad:"u",precioUnit:0.81}]},
  { id:"c6", proveedor:"GAVE - Propio", provId:"prov6", nBoleta:"—", fecha:"2026-03-01", moneda:"PEN", montoOriginal:40.00, tc:3.49, items:[{descripcion:"Botellas propias Gave 1000ml",cantidad:100,unidad:"u",precioUnit:0.40}]},
  { id:"c7", proveedor:"DL & SON E.I.R.L.", provId:"prov1", nBoleta:"B002-00000124", fecha:"2026-04-08", moneda:"USD", montoOriginal:151.41, tc:3.49, items:[{descripcion:"Carbopol 940",cantidad:1,unidad:"kg",precioUnit:18.50},{descripcion:"Trietanolamina 100%",cantidad:1,unidad:"kg",precioUnit:5.50},{descripcion:"Ácido Sulfónico Lineal",cantidad:2,unidad:"kg",precioUnit:3.30}]},
  { id:"c8", proveedor:"CLAVES INDUSTRIALES R&K SRL", provId:"prov5", nBoleta:"B001-0062673", fecha:"2026-04-09", moneda:"PEN", montoOriginal:250.00, tc:3.49, items:[{descripcion:"Blanqueador Óptico BY3B",cantidad:2,unidad:"kg",precioUnit:23.73},{descripcion:"Aceite Pino 85%",cantidad:2,unidad:"kg",precioUnit:42.375},{descripcion:"Perlante en Frío (Laurion PK)",cantidad:2,unidad:"kg",precioUnit:23.73},{descripcion:"Alcohol Cetílico (Vegarol 1698)",cantidad:1,unidad:"kg",precioUnit:16.95},{descripcion:"Deyquart-A (Cloruro de Cetrimonio 40%)",cantidad:1,unidad:"kg",precioUnit:15.25}]},
  { id:"c9", proveedor:"CLAVES INDUSTRIALES R&K SRL", provId:"prov5", nBoleta:"B001-0062701", fecha:"2026-04-09", moneda:"PEN", montoOriginal:90.00, tc:3.49, items:[{descripcion:"Antifoam TP200 (Antiespumante)",cantidad:1,unidad:"kg",precioUnit:29.66},{descripcion:"Aurobet C-TP200 Betaína Espumante",cantidad:1,unidad:"kg",precioUnit:10.17},{descripcion:"Cocamide DEA (Coperlam)",cantidad:1,unidad:"kg",precioUnit:15.25},{descripcion:"Colorante Amarillo Piranine",cantidad:0.1,unidad:"kg",precioUnit:211.90}]},
];

const TC = 3.49;
const mkU = (n, u, stock, pgUSD, prov, extra={}) => ({ n, insumo:n, u, unidad:u, stock, pg:pgUSD*TC, pgOrigen:pgUSD, monedaOrigen:"USD", prov, ...extra });
const INSUMOS_INICIALES = [
  mkU("Lauril Ether Sulfato de Sodium 70%","kg",20,2.66,"DL & SON E.I.R.L."),
  mkU("Betaína","kg",2,1.89,"DL & SON E.I.R.L."),
  mkU("Coperland KD - Dietanolamina Coco","kg",2,3.54,"DL & SON E.I.R.L."),
  mkU("EDTA Tetrasódico","kg",2,4.76,"DL & SON E.I.R.L."),
  mkU("Glicerina USP","kg",2,2.20,"DL & SON E.I.R.L."),
  mkU("Trietanolamina 100%","kg",2,5.50,"DL & SON E.I.R.L."),
  mkU("Ácido Sulfónico Lineal","kg",4,3.30,"DL & SON E.I.R.L."),
  mkU("Hipoclorito 8%","kg",1,0.45,"DL & SON E.I.R.L."),
  mkU("Sal - Cloruro de Sodio","kg",1,0.50,"DL & SON E.I.R.L."),
  mkU("Fragancia Floral Clásico","kg",0.75,28.32,"DL & SON E.I.R.L."),
  mkU("Fragancia Lavanda","kg",0.75,25.49,"DL & SON E.I.R.L."),
  mkU("Fragancia Baby Intense","kg",0.25,21.24,"DL & SON E.I.R.L."),
  mkU("Fragancia Limón Fresco","kg",0.75,29.90,"DL & SON E.I.R.L."),
  mkU("Fragancia Manzana","kg",0.25,25.96,"DL & SON E.I.R.L."),
  mkU("Fragancia Brisa Marina","kg",0.25,21.24,"DL & SON E.I.R.L."),
  mkU("Fragancia Dove Plus","kg",0.5,31.15,"DL & SON E.I.R.L."),
  mkU("Colorante Verde","kg",0.1,41.30,"DL & SON E.I.R.L."),
  mkU("Colorante Azul","kg",0.1,41.30,"DL & SON E.I.R.L."),
  mkU("Colorante Rojo","kg",0.1,41.30,"DL & SON E.I.R.L."),
  mkU("Colorante Amarillo","kg",0.1,41.30,"DL & SON E.I.R.L."),
  mkU("Potasa Cáustica 90%","kg",2,2.60,"DL & SON E.I.R.L."),
  mkU("Preservante - Biocida","u",2,3.71,"DL & SON E.I.R.L."),
  mkU("Nonil Fenol 10 Moles - NP10","kg",3,3.80,"DL & SON E.I.R.L."),
  mkU("Carbopol 940","kg",1,18.50,"DL & SON E.I.R.L."),
  mkU("Cloruro de Cetrimonio Quartamin 60","kg",1,4.70,"DL & SON E.I.R.L."),
  mkU("Ácido Cítrico","kg",1,1.95,"DL & SON E.I.R.L."),
  mkU("CMC Tixotrol","u",1,8.00,"DL & SON E.I.R.L."),
  mkU("Óxido de Amina","kg",1,3.71,"DL & SON E.I.R.L."),
  mkU("Propilenglicol","u",1,3.78,"DL & SON E.I.R.L."),
  { n:"Hipoclorito de Sodio", insumo:"Hipoclorito de Sodio", u:"lt", unidad:"lt", stock:20, pg:1.30, prov:"VELQUIMICOS S.A.C." },
  { n:"Bidón", insumo:"Bidón", u:"u", unidad:"u", stock:1, pg:6.999, prov:"VELQUIMICOS S.A.C." },
  { n:"Ácido Sulfónico", insumo:"Ácido Sulfónico", u:"kg", unidad:"kg", stock:2, pg:13.00, prov:"VELQUIMICOS S.A.C." },
  { n:"Butil Glicol", insumo:"Butil Glicol", u:"kg", unidad:"kg", stock:2, pg:14.998, prov:"VELQUIMICOS S.A.C." },
  { n:"Alcohol Isopropílico", insumo:"Alcohol Isopropílico", u:"lt", unidad:"lt", stock:2, pg:7.493, prov:"VELQUIMICOS S.A.C." },
  { n:"Silicona 60", insumo:"Silicona 60", u:"kg", unidad:"kg", stock:1, pg:16.992, prov:"VELQUIMICOS S.A.C." },
  { n:"Nacarante", insumo:"Nacarante", u:"kg", unidad:"kg", stock:1, pg:25.00, prov:"DUO KLEEN S.A.C." },
  { n:"Cloruro de Benzalconio", insumo:"Cloruro de Benzalconio", u:"kg", unidad:"kg", stock:2, pg:25.00, prov:"DUO KLEEN S.A.C." },
  { n:"Envase PET Gatillo 650ml", insumo:"Envase PET Gatillo 650ml", u:"u", unidad:"u", stock:100, pg:0.77, prov:"TRESCOPERU S.A.C.", env:true },
  { n:"Envase PET Multiuso 1000ml", insumo:"Envase PET Multiuso 1000ml", u:"u", unidad:"u", stock:100, pg:0.81, prov:"TRESCOPERU S.A.C.", env:true },
  { n:"Tapa Gatillo Blanco B28/410", insumo:"Tapa Gatillo Blanco B28/410", u:"u", unidad:"u", stock:100, pg:0.72, prov:"TRESCOPERU S.A.C.", env:true },
  { n:"Tapa Polipropileno Rosca Larga", insumo:"Tapa Polipropileno Rosca Larga", u:"u", unidad:"u", stock:100, pg:0.072, prov:"TRESCOPERU S.A.C.", env:true },
  { n:"Botella Gave 1000ml", insumo:"Botella Gave 1000ml", u:"u", unidad:"u", stock:100, pg:0.40, prov:"GAVE - Propio", env:true },
  { n:"Blanqueador Óptico BY3B", insumo:"Blanqueador Óptico BY3B", u:"kg", unidad:"kg", stock:2, pg:23.73, prov:"R&K SRL" },
  { n:"Aceite Pino 85%", insumo:"Aceite Pino 85%", u:"kg", unidad:"kg", stock:2, pg:42.375, prov:"R&K SRL" },
  { n:"Perlante en Frío (Laurion PK)", insumo:"Perlante en Frío (Laurion PK)", u:"kg", unidad:"kg", stock:2, pg:23.73, prov:"R&K SRL" },
  { n:"Alcohol Cetílico (Vegarol 1698)", insumo:"Alcohol Cetílico (Vegarol 1698)", u:"kg", unidad:"kg", stock:1, pg:16.95, prov:"R&K SRL" },
  { n:"Deyquart-A (Cloruro Cetrimonio 40%)", insumo:"Deyquart-A (Cloruro Cetrimonio 40%)", u:"kg", unidad:"kg", stock:1, pg:15.25, prov:"R&K SRL" },
  { n:"Antifoam TP200 (Antiespumante)", insumo:"Antifoam TP200 (Antiespumante)", u:"kg", unidad:"kg", stock:1, pg:29.66, prov:"R&K SRL" },
  { n:"Betaína Espumante (Aurobet C-TP200)", insumo:"Betaína Espumante (Aurobet C-TP200)", u:"kg", unidad:"kg", stock:1, pg:10.17, prov:"R&K SRL" },
  { n:"Cocamide DEA (Coperlam)", insumo:"Cocamide DEA (Coperlam)", u:"kg", unidad:"kg", stock:1, pg:15.25, prov:"R&K SRL" },
  { n:"Colorante Amarillo Piranine", insumo:"Colorante Amarillo Piranine", u:"kg", unidad:"kg", stock:0.1, pg:211.90, prov:"R&K SRL" },
];

function f2(n){return parseFloat(n||0).toFixed(2)}
function fDate(ts){return new Date(ts).toLocaleDateString("es-PE",{day:"2-digit",month:"short",year:"2-digit"})}
function fDateStr(str){if(!str)return"—";return new Date(str+"T12:00:00").toLocaleDateString("es-PE",{day:"2-digit",month:"short",year:"2-digit"})}
function montoEnSoles(c){return c.moneda==="USD"?c.montoOriginal*(c.tc||3.49):c.montoOriginal}

// Helper: total real de una venta (suma items + delivery)
function ventaTotalReal(v){
  if(v.items&&Array.isArray(v.items)){
    const subtotal=v.items.reduce((s,it)=>(s+(it.lt||0)*(it.pr||0)),0);
    return subtotal+(parseFloat(v.delivery)||0);
  }
  return (v.tot||0)+(parseFloat(v.delivery)||0);
}

function useToast(){
  const [toast,setToast]=useState(null);
  const timerRef=useRef(null);
  const show=useCallback((msg,ok=true)=>{clearTimeout(timerRef.current);setToast({msg,ok});timerRef.current=setTimeout(()=>setToast(null),2400)},[]);
  return{toast,show};
}

function calcProd(p,insumos){
  if(!p||!insumos)return{tot:0,cpl:0,gl:0,gt:0,mrg:0};
  const lt=p.lt||p.customLiters||1,pv=p.pv||0;
  let tot=0;
  (p.ings||[]).forEach(ing=>{
    const s=insumos.find(i=>i.id===ing.sid);
    if(!s)return;
    tot+=(ing.env||s.env)?(s.pg||0)*lt:(s.pg||0)*ing.c*lt;
  });
  const cpl=lt>0?tot/lt:0,gl=pv-cpl,gt=gl*lt,mrg=pv>0?(gl/pv)*100:0;
  return{tot,cpl,gl,gt,mrg};
}

const IS={width:"100%",background:"#e5edf7",border:"1.5px solid #c4d4e8",borderRadius:8,color:"#1a2540",fontSize:14,padding:"10px 12px",outline:"none",boxSizing:"border-box"};
function Field({label,children}){return(<div style={{marginBottom:10}}><div style={{fontSize:11,fontWeight:700,color:"#4a5d7a",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4}}>{label}</div>{children}</div>)}
function BtnPrimary({onClick,children,color="#1565c0"}){return<button onClick={onClick} style={{width:"100%",padding:13,background:color,border:"none",borderRadius:12,color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",marginTop:4,display:"block"}}>{children}</button>}
function BtnSecondary({onClick,children}){return<button onClick={onClick} style={{width:"100%",padding:11,background:"transparent",border:"1.5px solid #c4d4e8",borderRadius:12,color:"#4a5d7a",fontSize:14,fontWeight:600,cursor:"pointer",marginTop:6,display:"block"}}>{children}</button>}
function BtnDanger({onClick,children}){return<button onClick={onClick} style={{width:"100%",padding:11,background:"#fdf0ef",border:"1.5px solid #c0392b",borderRadius:12,color:"#c0392b",fontSize:14,fontWeight:700,cursor:"pointer",marginTop:6,display:"block"}}>{children}</button>}
function ModalShell({title,onClose,children}){return(<div style={{position:"fixed",inset:0,background:"rgba(10,20,50,.35)",zIndex:300,display:"flex",alignItems:"flex-end"}} onClick={e=>e.target===e.currentTarget&&onClose()}><div style={{background:"#fff",borderRadius:"20px 20px 0 0",width:"100%",padding:"18px 16px 28px",maxHeight:"92vh",overflowY:"auto"}}><div style={{fontSize:16,fontWeight:800,marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>{title}<button onClick={onClose} style={{width:30,height:30,borderRadius:"50%",border:"1.5px solid #c4d4e8",background:"#e5edf7",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",color:"#4a5d7a"}}>×</button></div>{children}</div></div>)}

// ──────── INICIO ─────────────────────────────────────────────
function PgInicio({products,insumos,ventas,compras,stockProductos,setPage,setCurProd,onNewProd}){
  // FIX: usar ventaTotalReal para calcular totales correctamente
  const totV=ventas.reduce((s,v)=>s+ventaTotalReal(v),0);
  const totC=compras.reduce((s,c)=>s+montoEnSoles(c),0);
  const fiadas=ventas.filter(v=>v.pago==="fiado"&&!v.cobrado);
  const totFiado=fiadas.reduce((s,v)=>s+ventaTotalReal(v),0);

  return(
    <div style={{paddingBottom:76}}>
      <div style={{background:"linear-gradient(135deg,#1565c0,#0d47a1 55%,#1a237e)",padding:"22px 16px 18px",color:"#fff"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <img src="/logo1.png" style={{height:48,objectFit:"contain",filter:"brightness(0) invert(1)"}} />
          <div style={{textAlign:"center"}}><div style={{fontSize:22,fontWeight:800,letterSpacing:".02em"}}>SIONEX</div><div style={{fontSize:11,opacity:.75,marginTop:2}}>Sistema de gestión · ventas · inventario</div></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
          {[[products.length,"Productos"],[`S/${f2(totV)}`,"Ventas"],[insumos.length,"Insumos"],[`S/${Math.round(totC)}`,"Compras"]].map(([v,l])=>(
            <div key={l} style={{background:"rgba(255,255,255,.12)",borderRadius:10,padding:"10px 4px",textAlign:"center",border:"1px solid rgba(255,255,255,.15)"}}>
              <div style={{fontSize:15,fontWeight:800,fontFamily:"monospace"}}>{v}</div>
              <div style={{fontSize:9,opacity:.75,marginTop:2,fontWeight:600,textTransform:"uppercase",letterSpacing:".04em"}}>{l}</div>
            </div>
          ))}
        </div>
        {totFiado>0&&<div style={{marginTop:10,background:"rgba(192,57,43,.25)",border:"1.5px solid rgba(192,57,43,.5)",borderRadius:8,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:12,fontWeight:700}}>⚠️ Fiado pendiente de cobro</span>
          <span style={{fontSize:14,fontWeight:800,fontFamily:"monospace"}}>S/{f2(totFiado)}</span>
        </div>}
      </div>

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px 8px"}}>
        <div style={{fontSize:10,fontWeight:800,color:"#8a9ab8",letterSpacing:".1em",textTransform:"uppercase"}}>Stock de productos</div>
        <button onClick={()=>setPage("stock")} style={{padding:"5px 12px",border:"1.5px solid #0d7377",borderRadius:30,background:"#e0f5f5",color:"#0d7377",fontSize:12,fontWeight:700,cursor:"pointer"}}>Ver stock</button>
      </div>
      <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:6,marginBottom:8}}>
        {stockProductos.map(sp=>{
          const prod=products.find(p=>String(p.id)===String(sp.prodId));
          if(!prod)return null;
          const cl=CL[prod.col||"blue"]||CL.blue;
          const bajo=sp.litros<=2;
          return(
            <div key={sp.id} style={{background:"#fff",border:`1px solid ${bajo?"#f5c6c2":"#dce6f0"}`,borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,boxShadow:"0 1px 6px rgba(21,101,192,.06)"}}>
              <div style={{width:36,height:36,borderRadius:10,background:cl.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{prod.ico||prod.emoji||"🧴"}</div>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700}}>{prod.n||prod.name}</div><div style={{fontSize:11,color:"#8a9ab8"}}>S/{f2(prod.pv||0)}/L</div></div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:18,fontWeight:800,fontFamily:"monospace",color:bajo?"#c0392b":"#1b7a4a"}}>{sp.litros}L</div>
                <div style={{fontSize:10,color:bajo?"#c0392b":"#8a9ab8"}}>{bajo?"⚠️ stock bajo":"en stock"}</div>
              </div>
            </div>
          );
        })}
        {stockProductos.length===0&&<div style={{textAlign:"center",padding:"16px",color:"#8a9ab8",fontSize:13}}>Sin stock registrado. Ve a "Ver stock" para agregar.</div>}
      </div>

    </div>
  );
}

// ──────── STOCK DE PRODUCTOS TERMINADOS ──────────────────────
function PgStock({products,stockProductos,onRefresh,showToast}){
  const [showAdd,setShowAdd]=useState(false);
  const [editItem,setEditItem]=useState(null);

  async function saveStock(data){
    if(data.id){await apiFetch.put(`/stock/${data.id}`,data);}
    else{await apiFetch.post("/stock",data);}
    onRefresh();showToast("Stock actualizado ✓");
    setShowAdd(false);setEditItem(null);
  }
  async function delStock(id){
    if(!confirm("¿Eliminar este registro de stock?"))return;
    await apiFetch.del(`/stock/${id}`);
    onRefresh();showToast("Eliminado");setEditItem(null);
  }

  return(
    <div style={{paddingBottom:76}}>
      <div style={{padding:"14px 16px 10px",background:"#fff",borderBottom:"1px solid #dce6f0",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 10px rgba(21,101,192,.07)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><div style={{fontSize:20,fontWeight:800}}>Stock de productos</div><div style={{fontSize:12,color:"#4a5d7a",marginTop:1}}>Litros producidos disponibles para venta</div></div>
          <button onClick={()=>setShowAdd(true)} style={{padding:"7px 14px",border:"1.5px solid #0d7377",borderRadius:30,background:"#e0f5f5",color:"#0d7377",fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Agregar</button>
        </div>
      </div>
      <div style={{height:10}}/>
      <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:8}}>
        {stockProductos.map(sp=>{
          const prod=products.find(p=>String(p.id)===String(sp.prodId));
          if(!prod)return null;
          const cl=CL[prod.col||"blue"]||CL.blue;
          const bajo=sp.litros<=2;
          return(
            <div key={sp.id} onClick={()=>setEditItem(sp)} style={{background:"#fff",border:`1.5px solid ${bajo?"#f5c6c2":"#dce6f0"}`,borderRadius:12,padding:"13px 14px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",boxShadow:"0 2px 10px rgba(21,101,192,.06)"}}>
              <div style={{width:46,height:46,borderRadius:12,background:cl.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{prod.ico||prod.emoji||"🧴"}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontWeight:700}}>{prod.n||prod.name}</div>
                <div style={{fontSize:11,color:"#8a9ab8",marginTop:2}}>Precio venta: S/{f2(prod.pv||0)}/L</div>
                {sp.nota&&<div style={{fontSize:11,color:"#4a5d7a",marginTop:2,fontStyle:"italic"}}>{sp.nota}</div>}
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:24,fontWeight:800,fontFamily:"monospace",color:bajo?"#c0392b":"#1b7a4a"}}>{sp.litros}L</div>
                {bajo&&<div style={{fontSize:10,color:"#c0392b",fontWeight:700}}>⚠️ Stock bajo</div>}
              </div>
            </div>
          );
        })}
        {stockProductos.length===0&&<div style={{textAlign:"center",padding:"36px 20px",color:"#8a9ab8",fontSize:14}}>Sin stock registrado.<br/>Toca "+ Agregar" para ingresar litros producidos.</div>}
      </div>
      {showAdd&&<ModalStock products={products} onClose={()=>setShowAdd(false)} onSave={saveStock}/>}
      {editItem&&<ModalStock item={editItem} products={products} onClose={()=>setEditItem(null)} onSave={saveStock} onDelete={()=>delStock(editItem.id)}/>}
    </div>
  );
}

function ModalStock({item,products,onClose,onSave,onDelete}){
  const [prodId,setProdId]=useState(item?.prodId||String(products[0]?.id||""));
  const [litros,setLitros]=useState(item?.litros||0);
  const [nota,setNota]=useState(item?.nota||"");
  function save(){
    if(!prodId)return alert("Selecciona un producto");
    const prod=products.find(p=>String(p.id)===String(prodId));
    onSave({id:item?.id,prodId,prodNombre:prod?.n||prod?.name||"—",litros:parseFloat(litros)||0,nota,ts:item?.ts||Date.now()});
  }
  return(
    <ModalShell title={item?"Editar stock":"Agregar stock"} onClose={onClose}>
      <Field label="Producto">
        <select value={prodId} onChange={e=>setProdId(e.target.value)} style={IS}>
          {products.map(p=><option key={p.id} value={String(p.id)}>{p.ico||p.emoji||"🧴"} {p.n||p.name}</option>)}
        </select>
      </Field>
      <Field label="Litros en stock">
        <input type="number" value={litros} onChange={e=>setLitros(e.target.value)} min="0" step="0.5" inputMode="decimal" style={IS}/>
      </Field>
      <Field label="Nota (opcional)">
        <input value={nota} onChange={e=>setNota(e.target.value)} placeholder="Ej: Producción del 10/04" style={IS}/>
      </Field>
      <BtnPrimary onClick={save} color="#0d7377">{item?"Guardar cambios":"Agregar stock"}</BtnPrimary>
      {item&&onDelete&&<BtnDanger onClick={onDelete}>Eliminar registro</BtnDanger>}
      <BtnSecondary onClick={onClose}>Cancelar</BtnSecondary>
    </ModalShell>
  );
}

// ──────── FÓRMULA ────────────────────────────────────────────
function PgFormula({prod,insumos,onBack,onRefresh,showToast}){
  const [p,setP]=useState(null);
  const [editingProd,setEditingProd]=useState(false);
  const [editMode,setEditMode]=useState(false);
  const [showDupModal,setShowDupModal]=useState(false);
  const [dupName,setDupName]=useState("");

  useEffect(()=>{if(prod)setP({...prod,lt:prod.lt||prod.customLiters||1,pv:prod.pv||0,ings:prod.ings||[]})},[prod]);
  if(!p)return null;

  const{tot,cpl,gl,gt,mrg}=calcProd(p,insumos);
  const pos=gl>=0;

  async function patch(data){const updated={...p,...data};setP(updated);await apiFetch.put(`/products/${p.id}`,data);onRefresh()}
  async function onCant(i,v){const t=parseFloat(v)||0;const newIngs=p.ings.map((ing,idx)=>idx===i?{...ing,c:p.lt>0?t/p.lt:t}:ing);await patch({ings:newIngs})}
  async function onIns(i,sidStr){const sid=parseInt(sidStr);const s=insumos.find(x=>x.id===sid);const newIngs=p.ings.map((ing,idx)=>idx===i?{...ing,sid,env:s?.env||false}:ing);await patch({ings:newIngs})}
  async function delIng(i){await patch({ings:p.ings.filter((_,idx)=>idx!==i)})}
  async function addIng(){await patch({ings:[...p.ings,{sid:insumos[0]?.id||1,c:10,u:"g"}]})}
  async function duplicar(){
    if(!dupName.trim())return alert("Escribe un nombre para la copia");
    await apiFetch.post("/products",{...p,id:undefined,n:dupName,name:dupName,ings:[...p.ings]});
    setShowDupModal(false);setDupName("");onRefresh();showToast("Fórmula duplicada ✓");onBack();
  }

  return(
    <div style={{paddingBottom:76}}>
      <div style={{background:"#fff",padding:"12px 16px",borderBottom:"1px solid #dce6f0",display:"flex",alignItems:"center",gap:10,position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 10px rgba(21,101,192,.07)"}}>
        <button onClick={onBack} style={{width:36,height:36,borderRadius:10,border:"1.5px solid #c4d4e8",background:"#e5edf7",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#4a5d7a",fontSize:20}}>‹</button>
        <span style={{fontSize:24}}>{p.ico||p.emoji||"🧴"}</span>
        <div style={{flex:1}}><div style={{fontSize:17,fontWeight:800}}>{p.n||p.name}</div><div style={{fontSize:11,color:"#4a5d7a"}}>{p.ings.length} ingredientes · {p.lt}L</div></div>
        <button onClick={()=>{setDupName((p.n||p.name)+" (copia)");setShowDupModal(true)}} style={{padding:"7px 10px",border:"1.5px solid #0d7377",borderRadius:30,background:"#e0f5f5",color:"#0d7377",fontSize:12,fontWeight:700,cursor:"pointer"}}>⎘ Duplicar</button>
        {!editMode
          ?<button onClick={()=>setEditMode(true)} style={{padding:"7px 14px",border:"1.5px solid #1565c0",borderRadius:30,background:"#f0f6ff",color:"#1565c0",fontSize:12,fontWeight:700,cursor:"pointer"}}>✏️ Editar</button>
          :<button onClick={()=>{setEditMode(false);setEditingProd(false)}} style={{padding:"7px 14px",border:"1.5px solid #1b7a4a",borderRadius:30,background:"#e8f7ef",color:"#1b7a4a",fontSize:12,fontWeight:700,cursor:"pointer"}}>✓ Listo</button>
        }
        {editMode&&<button onClick={()=>setEditingProd(true)} style={{padding:"7px 10px",border:"1.5px solid #1565c0",borderRadius:30,background:"#f0f6ff",color:"#1565c0",fontSize:12,fontWeight:700,cursor:"pointer"}}>⚙️</button>}
      </div>
      {!editMode&&<div style={{background:"#fffbea",border:"1px solid #fde68a",padding:"8px 16px",fontSize:12,color:"#92400e",fontWeight:600,textAlign:"center"}}>🔒 Modo lectura — toca "Editar" para modificar</div>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,padding:"10px 16px",background:"#f0f6ff",borderBottom:"1px solid #e3f0ff"}}>
        {[{lbl:"Litros a preparar",val:p.lt,unit:"litros totales del lote",cb:v=>patch({lt:parseFloat(v)||1,customLiters:parseFloat(v)||1})},{lbl:"Precio venta S/",val:p.pv,unit:"por litro",cb:v=>patch({pv:parseFloat(v)||0})}].map(({lbl,val,unit,cb})=>(
          <div key={lbl} style={{background:"#fff",border:"1.5px solid #e3f0ff",borderRadius:8,padding:"10px 12px"}}>
            <div style={{fontSize:10,color:"#1565c0",fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",marginBottom:3}}>{lbl}</div>
            {editMode
              ?<input key={val} type="number" defaultValue={val} min="0" step="0.5" inputMode="decimal"
                onBlur={e=>cb(e.target.value)} onKeyDown={e=>e.key==="Enter"&&cb(e.target.value)}
                style={{width:"100%",background:"transparent",border:"none",color:"#1565c0",fontFamily:"monospace",fontSize:20,fontWeight:600,outline:"none",padding:0}}/>
              :<div style={{color:"#1565c0",fontFamily:"monospace",fontSize:20,fontWeight:600}}>{val}</div>
            }
            <div style={{fontSize:10,color:"#8a9ab8",marginTop:2}}>{unit}</div>
          </div>
        ))}
      </div>
      <div style={{padding:"10px 16px",display:"flex",flexDirection:"column",gap:6}}>
        {p.ings.map((ing,i)=>{
          const s=insumos.find(x=>x.id===ing.sid);
          const isE=ing.env||s?.env;
          const pgS=s?.pg||0;
          const cantTotalKg=isE?1:ing.c*p.lt;
          const costoUso=isE?pgS*p.lt:pgS*cantTotalKg;
          const etqCant=isE?"1 u/lote":`${(cantTotalKg*1000)>=1000?(cantTotalKg).toFixed(3)+"kg":(cantTotalKg*1000).toFixed(1)+"g"}`;
          return(
            <div key={i} style={{background:"#fff",border:"1.5px solid #dce6f0",borderRadius:12,overflow:"hidden",boxShadow:"0 2px 10px rgba(21,101,192,.07)"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px"}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600}}>{s?.n||s?.insumo||"?"}</div>
                  <div style={{fontSize:11,color:"#8a9ab8",marginTop:2}}>{etqCant} · <span style={{color:"#1b7a4a",fontWeight:700}}>S/{costoUso.toFixed(3)}</span></div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  {editMode&&!isE?(<input key={`${i}-${p.lt}`} type="number" defaultValue={parseFloat((ing.c*p.lt*1000).toFixed(1))} step="1" min="0" inputMode="decimal"
                    onBlur={e=>onCant(i,(parseFloat(e.target.value)||0)/1000)} onKeyDown={e=>e.key==="Enter"&&onCant(i,(parseFloat(e.target.value)||0)/1000)}
                    style={{width:60,background:"#e5edf7",border:"1.5px solid #c4d4e8",borderRadius:6,color:"#1a2540",fontFamily:"monospace",fontSize:14,fontWeight:600,textAlign:"right",padding:"4px 5px",outline:"none"}}/>
                  ):<span style={{fontSize:13,color:"#4a5d7a",fontFamily:"monospace"}}>{isE?"1":parseFloat((ing.c*p.lt*1000).toFixed(1))}</span>}
                  <span style={{fontSize:11,color:"#8a9ab8",minWidth:16}}>{isE?"u/lote":"g"}</span>
                </div>
                {editMode&&<button onClick={()=>delIng(i)} style={{width:28,height:28,borderRadius:6,border:"1.5px solid #dce6f0",background:"transparent",color:"#8a9ab8",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>}
              </div>
              {editMode&&<div style={{padding:"5px 12px 9px",borderTop:"1px solid #dce6f0"}}>
                <select value={ing.sid} onChange={e=>onIns(i,e.target.value)} style={{width:"100%",background:"#e5edf7",border:"1.5px solid #c4d4e8",borderRadius:6,color:"#4a5d7a",fontSize:12,padding:"6px 7px",outline:"none"}}>
                  {insumos.map(s=><option key={s.id} value={s.id}>{s.n||s.insumo} — {s.prov||"—"}</option>)}
                </select>
              </div>}
            </div>
          );
        })}
      </div>
      {editMode&&<button onClick={addIng} style={{margin:"2px 16px 6px",width:"calc(100% - 32px)",padding:11,background:"transparent",border:"1.5px dashed #c4d4e8",borderRadius:8,color:"#8a9ab8",fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
        + Agregar insumo
      </button>}
      {showDupModal&&(
        <ModalShell title="Duplicar fórmula" onClose={()=>setShowDupModal(false)}>
          <div style={{fontSize:13,color:"#4a5d7a",marginBottom:12}}>Se copiará la fórmula completa de <strong>{p.n||p.name}</strong>. Solo cambia el nombre:</div>
          <Field label="Nombre de la copia">
            <input value={dupName} onChange={e=>setDupName(e.target.value)} placeholder="Ej: Limpia Todo Lavanda" style={IS} autoFocus/>
          </Field>
          <BtnPrimary onClick={duplicar} color="#0d7377">⎘ Crear copia</BtnPrimary>
          <BtnSecondary onClick={()=>setShowDupModal(false)}>Cancelar</BtnSecondary>
        </ModalShell>
      )}
      <div style={{margin:"6px 16px 4px",background:"#f0f6ff",border:"1.5px solid #e3f0ff",borderRadius:12,padding:14,borderTop:"3px solid #1565c0"}}>
        <div style={{fontSize:11,fontWeight:800,color:"#1565c0",textTransform:"uppercase",letterSpacing:".06em",marginBottom:10}}>Resumen económico</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          {[["Costo / litro",`S/${f2(cpl)}`,"#1565c0"],["Ganancia / litro",`${pos?"+":""}S/${f2(gl)}`,pos?"#1b7a4a":"#c0392b"]].map(([l,v,c])=>(
            <div key={l}><div style={{fontSize:10,color:"#4a5d7a",fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",marginBottom:3}}>{l}</div><div style={{fontSize:22,fontWeight:800,fontFamily:"monospace",color:c}}>{v}</div></div>
          ))}
        </div>
        <div style={{height:1,background:"#e3f0ff",margin:"8px 0"}}/>
        {[[`Costo total lote (${p.lt}L)`,`S/${f2(tot)}`],["Ingreso por venta",`S/${f2((p.pv||0)*p.lt)}`],[`Ganancia total`,`${pos?"+":""}S/${f2(gt)}`],["Margen",`${mrg.toFixed(1)}%`]].map(([l,v])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"3px 0"}}>
            <span style={{fontSize:12,color:"#4a5d7a"}}>{l}</span>
            <span style={{fontSize:13,fontWeight:700,fontFamily:"monospace"}}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{height:14}}/>
      {editingProd&&editMode&&<ModalProd prod={p}
        onClose={()=>setEditingProd(false)}
        onSave={async(data)=>{await apiFetch.put(`/products/${p.id}`,data);setP(prev=>({...prev,...data}));setEditingProd(false);onRefresh();showToast("Producto actualizado ✓")}}
        onDelete={async()=>{if(!confirm("¿Eliminar este producto?"))return;await apiFetch.del(`/products/${p.id}`);onBack();onRefresh();showToast("Eliminado")}}
      />}
    </div>
  );
}

function ModalProd({prod,onClose,onSave,onDelete}){
  const [ico,setIco]=useState(prod?.ico||prod?.emoji||"🧴");
  const [nm,setNm]=useState(prod?.n||prod?.name||"");
  const [col,setCol]=useState(prod?.col||"blue");
  const [lt,setLt]=useState(prod?.lt||prod?.customLiters||10);
  const [pv,setPv]=useState(prod?.pv||10);
  function save(){if(!nm.trim())return alert("Nombre requerido");onSave({ico,n:nm,name:nm,col,lt:parseFloat(lt)||10,customLiters:parseFloat(lt)||10,pv:parseFloat(pv)||0})}
  return(
    <ModalShell title={prod?"Editar producto":"Nuevo producto"} onClose={onClose}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
        <Field label="Ícono"><input value={ico} onChange={e=>setIco(e.target.value)} maxLength={4} style={IS}/></Field>
        <Field label="Color"><select value={col} onChange={e=>setCol(e.target.value)} style={IS}>{Object.keys(CL).map(k=><option key={k} value={k}>{k}</option>)}</select></Field>
      </div>
      <Field label="Nombre del producto"><input value={nm} onChange={e=>setNm(e.target.value)} placeholder="Ej: Suavizante" style={IS}/></Field>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
        <Field label="Litros base"><input type="number" value={lt} onChange={e=>setLt(e.target.value)} inputMode="decimal" style={IS}/></Field>
        <Field label="Precio venta S/L"><input type="number" value={pv} onChange={e=>setPv(e.target.value)} inputMode="decimal" style={IS}/></Field>
      </div>
      <BtnPrimary onClick={save}>{prod?"Guardar cambios":"Crear producto"}</BtnPrimary>
      {prod&&onDelete&&<BtnDanger onClick={onDelete}>Eliminar producto</BtnDanger>}
      <BtnSecondary onClick={onClose}>Cancelar</BtnSecondary>
    </ModalShell>
  );
}

// ──────── INVENTARIO ─────────────────────────────────────────
function PgInventario({insumos,onRefresh,showToast}){
  const [q,setQ]=useState("");
  const [showAdd,setShowAdd]=useState(false);
  const [editItem,setEditItem]=useState(null);
  const filtered=insumos.filter(i=>(i.n||i.insumo||"").toLowerCase().includes(q.toLowerCase()));

  async function updStock(id,v){await apiFetch.put(`/inventario/${id}`,{stock:parseFloat(v)||0});onRefresh();showToast("Stock guardado ✓")}

  return(
    <div style={{paddingBottom:76}}>
      <div style={{padding:"14px 16px 10px",background:"#fff",borderBottom:"1px solid #dce6f0",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 10px rgba(21,101,192,.07)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><div style={{fontSize:20,fontWeight:800}}>Inventario</div><div style={{fontSize:12,color:"#4a5d7a",marginTop:1}}>{insumos.length} insumos</div></div>
        </div>
      </div>
      <div style={{height:10}}/>
      <div style={{display:"flex",alignItems:"center",gap:8,margin:"0 16px 10px",background:"#fff",border:"1.5px solid #c4d4e8",borderRadius:8,padding:"9px 12px"}}>
        🔍<input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar insumo..." style={{flex:1,border:"none",outline:"none",fontSize:14,background:"transparent",color:"#1a2540"}}/>
      </div>
      {filtered.map(s=>{
        const low=(s.stock||0)<=1;
        const pgS=s.pg||0;
        const prLabel=pgS>=1?`S/${pgS.toFixed(2)}/${s.u||s.unidad||"kg"}`:`S/${(pgS*1000).toFixed(3)}/g`;
        return(
          <div key={s.id} onClick={()=>setEditItem(s)} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 16px",background:"#fff",borderBottom:"1px solid #dce6f0",cursor:"pointer"}}>
            <div style={{width:10,height:10,borderRadius:"50%",flexShrink:0,background:"#4a5d7a"}}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600}}>{s.n||s.insumo}</div>
              <div style={{fontSize:11,color:"#8a9ab8",marginTop:2}}>{s.prov||"—"} · {prLabel}</div>
            </div>
            <div style={{textAlign:"right"}} onClick={e=>e.stopPropagation()}>
              <input type="number" defaultValue={s.stock||0} min="0" inputMode="decimal"
                onBlur={e=>updStock(s.id,e.target.value)} onKeyDown={e=>e.key==="Enter"&&updStock(s.id,e.target.value)}
                style={{width:64,background:"#e5edf7",border:"1.5px solid #c4d4e8",borderRadius:6,color:low?"#c0392b":"#1b7a4a",fontFamily:"monospace",fontSize:14,fontWeight:700,textAlign:"right",padding:"4px 6px",outline:"none"}}/>
              <div style={{fontSize:10,color:"#8a9ab8",marginTop:1}}>{s.u||s.unidad||"kg"}</div>
            </div>
          </div>
        );
      })}
      <button onClick={()=>setShowAdd(true)} style={{margin:"10px 16px",width:"calc(100% - 32px)",padding:11,background:"#fff",border:"1.5px dashed #c4d4e8",borderRadius:12,color:"#8a9ab8",fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
        + Agregar nuevo insumo
      </button>
      {showAdd&&<ModalInsumo onClose={()=>setShowAdd(false)} onSave={async d=>{await apiFetch.post("/inventario",d);setShowAdd(false);onRefresh();showToast("Insumo agregado ✓")}}/>}
      {editItem&&<ModalInsumo item={editItem} onClose={()=>setEditItem(null)}
        onSave={async d=>{await apiFetch.put(`/inventario/${editItem.id}`,d);setEditItem(null);onRefresh();showToast("Insumo actualizado ✓")}}
        onDelete={async()=>{if(!confirm("¿Eliminar?"))return;await apiFetch.del(`/inventario/${editItem.id}`);setEditItem(null);onRefresh();showToast("Eliminado")}}/>}
    </div>
  );
}

function ModalInsumo({item,onClose,onSave,onDelete}){
  const [n,setN]=useState(item?.n||item?.insumo||"");
  const [stock,setStock]=useState(item?.stock??0);
  const [u,setU]=useState(item?.u||item?.unidad||"kg");
  const [pg,setPg]=useState(item?.pg||0);
  const [prov,setProv]=useState(item?.prov||"DL & SON");
  function save(){if(!n.trim())return alert("Nombre requerido");onSave({n,insumo:n,stock:parseFloat(stock)||0,u,unidad:u,pg:parseFloat(pg)||0,prov})}
  return(
    <ModalShell title={item?"Editar insumo":"Nuevo insumo"} onClose={onClose}>
      <Field label="Nombre"><input value={n} onChange={e=>setN(e.target.value)} placeholder="Ej: Glicerina" style={IS}/></Field>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
        <Field label="Stock"><input type="number" value={stock} onChange={e=>setStock(e.target.value)} inputMode="decimal" style={IS}/></Field>
        <Field label="Unidad"><select value={u} onChange={e=>setU(e.target.value)} style={IS}>{["kg","g","lt","ml","u","bolsa"].map(x=><option key={x}>{x}</option>)}</select></Field>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
        <Field label="Precio unit. (S/)"><input type="number" value={pg} onChange={e=>setPg(e.target.value)} inputMode="decimal" style={IS}/></Field>
        <Field label="Proveedor"><select value={prov} onChange={e=>setProv(e.target.value)} style={IS}>{["DL & SON","VELQUIMICOS","DUO KLEEN","TRESCOPERU","R&K SRL","GAVE","Otro"].map(x=><option key={x}>{x}</option>)}</select></Field>
      </div>
      <BtnPrimary onClick={save}>{item?"Guardar cambios":"Agregar al inventario"}</BtnPrimary>
      {item&&onDelete&&<BtnDanger onClick={onDelete}>Eliminar insumo</BtnDanger>}
      <BtnSecondary onClick={onClose}>Cancelar</BtnSecondary>
    </ModalShell>
  );
}


// ──────── COMPROBANTE ────────────────────────────────────────
async function generarYCompartirComprobante(venta, products) {
  // Crear div temporal con el comprobante
  const div = document.createElement("div");
  div.style.cssText = "position:fixed;left:-9999px;top:0;width:380px;background:#fff;font-family:system-ui,sans-serif;padding:24px;box-sizing:border-box;";
  
  const fecha = new Date(venta.ts || venta.id).toLocaleDateString("es-PE", {day:"2-digit",month:"long",year:"numeric"});
  const totalReal = ventaTotalReal(venta);
  
  // Construir items HTML
  let itemsHtml = "";
  if (venta.items && venta.items.length > 0) {
    venta.items.forEach(it => {
      const subtotal = (it.lt||0)*(it.pr||0);
      itemsHtml += `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f0f0f0;font-size:13px;">
        <div><div style="font-weight:600;">${it.pn||"—"}</div><div style="color:#888;font-size:11px;">${it.lt}L × S/${parseFloat(it.pr).toFixed(2)}</div></div>
        <div style="font-weight:700;color:#1565c0;">S/${subtotal.toFixed(2)}</div>
      </div>`;
    });
  } else {
    const p = products.find(x => String(x.id) === String(venta.pid));
    itemsHtml = `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f0f0f0;font-size:13px;">
      <div><div style="font-weight:600;">${venta.pn||p?.n||"—"}</div><div style="color:#888;font-size:11px;">${venta.lt||0}L × S/${parseFloat(venta.pr||0).toFixed(2)}</div></div>
      <div style="font-weight:700;color:#1565c0;">S/${((venta.lt||0)*(venta.pr||0)).toFixed(2)}</div>
    </div>`;
  }

  if ((venta.delivery||0) > 0) {
    itemsHtml += `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f0f0f0;font-size:13px;">
      <div style="font-weight:600;">🛵 Delivery</div>
      <div style="font-weight:700;color:#b45309;">S/${parseFloat(venta.delivery).toFixed(2)}</div>
    </div>`;
  }

  const estadoPago = (venta.pago==="fiado"&&!venta.cobrado) ? "⚠️ FIADO PENDIENTE" : "✅ PAGADO";
  const estadoColor = (venta.pago==="fiado"&&!venta.cobrado) ? "#c0392b" : "#1b7a4a";

  div.innerHTML = `
    <div style="text-align:center;margin-bottom:16px;">
      <img src="/logo1.png" style="height:60px;object-fit:contain;margin-bottom:8px;" crossorigin="anonymous"/>
      <div style="font-size:18px;font-weight:800;color:#1565c0;">SIONEX</div>
      <div style="font-size:11px;color:#888;">Productos de limpieza de calidad</div>
      <div style="font-size:11px;color:#888;">📞 Pedidos: 925 367 306</div>
    </div>
    <div style="background:#f0f6ff;border-radius:8px;padding:10px 12px;margin-bottom:12px;">
      <div style="font-size:12px;color:#4a5d7a;margin-bottom:2px;">COMPROBANTE DE VENTA</div>
      <div style="font-size:13px;font-weight:700;">Cliente: ${venta.cli||venta.cliente||"—"}</div>
      <div style="font-size:12px;color:#888;">Fecha: ${fecha}</div>
    </div>
    <div style="margin-bottom:12px;">${itemsHtml}</div>
    <div style="background:#1565c0;color:#fff;borderRadius:8px;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;border-radius:8px;margin-bottom:12px;">
      <span style="font-size:14px;font-weight:700;">TOTAL</span>
      <span style="font-size:20px;font-weight:800;font-family:monospace;">S/${totalReal.toFixed(2)}</span>
    </div>
    <div style="text-align:center;font-size:13px;font-weight:700;color:${estadoColor};margin-bottom:12px;">${estadoPago}</div>
    <div style="text-align:center;border-top:1px dashed #ddd;padding-top:12px;">
      <div style="font-size:12px;color:#888;margin-bottom:8px;">Paga por YAPE</div>
      <img src="/yapegave.jpeg" style="width:180px;height:180px;object-fit:contain;border-radius:8px;display:block;margin:0 auto;" crossorigin="anonymous"/>
      <div style="font-size:14px;font-weight:800;color:#1565c0;margin-top:6px;">967 018 689</div>
      <div style="font-size:11px;color:#888;margin-top:4px;">¡Gracias por su compra! 🙌</div>
    </div>
  `;

  document.body.appendChild(div);

  try {
    // Cargar html2canvas desde CDN
    if (!window.html2canvas) {
      await new Promise((res, rej) => {
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });
    }
    const canvas = await window.html2canvas(div, { scale: 2, useCORS: true, backgroundColor: "#fff" });
    document.body.removeChild(div);

    canvas.toBlob(async (blob) => {
      const file = new File([blob], "comprobante_sionex.png", { type: "image/png" });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "Comprobante SIONEX" });
      } else {
        // Fallback: descargar imagen
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "comprobante_sionex.png";
        a.click(); URL.revokeObjectURL(url);
      }
    }, "image/png");
  } catch(e) {
    document.body.removeChild(div);
    alert("Error generando comprobante: " + e.message);
  }
}

// ──────── VENTAS ─────────────────────────────────────────────
function PgVentas({ventas,products,stockProductos,onRefresh,showToast}){
  const [showModal,setShowModal]=useState(false);
  const [filtro,setFiltro]=useState("todas");
  const [expandida,setExpandida]=useState(null);
  const [editando,setEditando]=useState(null); // venta siendo editada

  // FIX: usar ventaTotalReal en todos los cálculos
  const totV=ventas.reduce((s,v)=>s+ventaTotalReal(v),0);
  const totFiado=ventas.filter(v=>v.pago==="fiado"&&!v.cobrado).reduce((s,v)=>s+ventaTotalReal(v),0);

  async function delVenta(id){if(!confirm("¿Borrar esta venta?"))return;await apiFetch.del(`/ventas/${id}`);onRefresh();showToast("Eliminado")}
  async function marcarCobrado(v){await apiFetch.put(`/ventas/${v.id}`,{cobrado:true,pago:"pagado"});onRefresh();showToast("Cobrado ✓")}

  const ventasFiltradas=ventas.filter(v=>{
    if(filtro==="fiado")return v.pago==="fiado"&&!v.cobrado;
    if(filtro==="pagado")return v.pago==="pagado"||v.cobrado;
    return true;
  });

  return(
    <div style={{paddingBottom:76}}>
      <div style={{padding:"14px 16px 10px",background:"#fff",borderBottom:"1px solid #dce6f0",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 10px rgba(21,101,192,.07)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:20,fontWeight:800}}>Ventas</div>
            <div style={{fontSize:12,color:"#4a5d7a",marginTop:1}}>
              Total: S/{f2(totV)}
              {totFiado>0&&<span style={{color:"#c0392b",fontWeight:700,marginLeft:8}}>· Fiado: S/{f2(totFiado)}</span>}
            </div>
          </div>
          <button onClick={()=>setShowModal(true)} style={{padding:"7px 14px",border:"1.5px solid #1565c0",borderRadius:30,background:"#f0f6ff",color:"#1565c0",fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Nueva</button>
        </div>
        <div style={{display:"flex",gap:6,marginTop:10}}>
          {[["todas","Todas"],["fiado","Fiado ⚠️"],["pagado","Pagado ✓"]].map(([k,l])=>(
            <button key={k} onClick={()=>setFiltro(k)} style={{padding:"5px 12px",borderRadius:30,border:`1.5px solid ${filtro===k?"#1565c0":"#c4d4e8"}`,background:filtro===k?"#1565c0":"transparent",color:filtro===k?"#fff":"#4a5d7a",fontSize:12,fontWeight:600,cursor:"pointer"}}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{height:10}}/>
      {ventasFiltradas.length===0&&<div style={{textAlign:"center",padding:"36px 20px",color:"#8a9ab8",fontSize:14}}>Sin ventas en esta categoría.</div>}
      <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:8}}>
        {[...ventasFiltradas].reverse().map(v=>{
          const esFiado=v.pago==="fiado";
          const cobrado=v.cobrado;
          const borderColor=esFiado&&!cobrado?"#c0392b":"#dce6f0";
          const totalReal=ventaTotalReal(v);
          // Soporte multi-producto (items) y venta simple legacy (pid)
          const esMulti=v.items&&Array.isArray(v.items)&&v.items.length>0;
          const estaExpandida=expandida===v.id;

          return(
            <div key={v.id} style={{background:"#fff",border:`1.5px solid ${borderColor}`,borderRadius:12,padding:"12px 14px",boxShadow:"0 2px 10px rgba(21,101,192,.07)"}}>
              {/* Header */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{fontSize:14,fontWeight:700}}>{v.cli||v.cliente||"—"}</span>
                <span style={{fontSize:11,color:"#8a9ab8",fontFamily:"monospace"}}>{fDate(v.ts||v.id)}</span>
              </div>
              {/* Tags */}
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:8}}>
                {esMulti ? (
                  // Venta multi-producto: mostrar cantidad de productos
                  <span
                    onClick={()=>setExpandida(estaExpandida?null:v.id)}
                    style={{padding:"2px 8px",borderRadius:30,fontSize:11,fontWeight:600,background:"#e3f0ff",color:"#1565c0",cursor:"pointer",userSelect:"none"}}
                  >
                    {v.items.length} producto{v.items.length>1?"s":""} {estaExpandida?"▲":"▼"}
                  </span>
                ) : (
                  // Venta simple legacy
                  (() => {
                    const p=products.find(x=>String(x.id)===String(v.pid)||String(x.id)===String(v.productId));
                    const cl=CL[p?.col||"blue"]||CL.blue;
                    return(<>
                      <span style={{padding:"2px 8px",borderRadius:30,fontSize:11,fontWeight:600,background:cl.bg,color:cl.t}}>{p?.ico||p?.emoji||""} {v.pn||p?.n||p?.name||"—"}</span>
                      <span style={{padding:"2px 8px",borderRadius:30,fontSize:11,fontWeight:600,background:"#e3f0ff",color:"#1565c0"}}>{v.lt||v.litros||0}L</span>
                    </>);
                  })()
                )}
                <span style={{padding:"2px 8px",borderRadius:30,fontSize:11,fontWeight:700,background:esFiado&&!cobrado?"#fdf0ef":cobrado?"#e8f7ef":"#e8f7ef",color:esFiado&&!cobrado?"#c0392b":"#1b7a4a"}}>
                  {esFiado&&!cobrado?"⚠️ Fiado":cobrado?"✓ Cobrado":"✓ Pagado"}
                </span>
                {v.delivery>0&&<span style={{padding:"2px 8px",borderRadius:30,fontSize:11,fontWeight:600,background:"#fef3e2",color:"#b45309"}}>🛵 S/{f2(v.delivery)}</span>}
                {v.nt&&<span style={{padding:"2px 8px",borderRadius:30,fontSize:11,fontWeight:600,background:"#e5edf7",color:"#4a5d7a"}}>{v.nt}</span>}
              </div>

              {/* Detalle expandido multi-producto */}
              {esMulti&&estaExpandida&&(
                <div style={{background:"#f8fbff",border:"1px solid #e3f0ff",borderRadius:8,padding:"8px 10px",marginBottom:8}}>
                  {v.items.map((it,idx)=>{
                    const p=products.find(x=>String(x.id)===String(it.pid));
                    const cl=CL[p?.col||"blue"]||CL.blue;
                    return(
                      <div key={idx} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:idx<v.items.length-1?"1px solid #e3f0ff":"none"}}>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <span style={{padding:"1px 7px",borderRadius:20,fontSize:11,fontWeight:600,background:cl.bg,color:cl.t}}>{p?.ico||"🧴"} {it.pn||p?.n||p?.name||"—"}</span>
                          <span style={{fontSize:11,color:"#4a5d7a"}}>{it.lt}L × S/{f2(it.pr)}</span>
                        </div>
                        <span style={{fontSize:12,fontWeight:700,fontFamily:"monospace",color:"#1b7a4a"}}>S/{f2((it.lt||0)*(it.pr||0))}</span>
                      </div>
                    );
                  })}
                  {v.delivery>0&&(
                    <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderTop:"1px solid #e3f0ff",marginTop:2}}>
                      <span style={{fontSize:11,color:"#b45309"}}>🛵 Delivery</span>
                      <span style={{fontSize:12,fontWeight:700,fontFamily:"monospace",color:"#b45309"}}>S/{f2(v.delivery)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Footer */}
              <div style={{borderTop:"1px solid #f0f4f8",paddingTop:8,marginTop:4}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  {!esMulti&&<span style={{fontSize:12,color:"#4a5d7a",fontFamily:"monospace"}}>S/{f2(v.pr||v.precio||0)}/L</span>}
                  {esMulti&&<span style={{fontSize:12,color:"#4a5d7a"}}>{v.items.length} prods</span>}
                  <span style={{fontSize:18,fontWeight:800,color:esFiado&&!cobrado?"#c0392b":"#1b7a4a",fontFamily:"monospace"}}>S/{f2(totalReal)}</span>
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {esFiado&&!cobrado&&<button onClick={()=>marcarCobrado(v)} style={{flex:1,padding:"7px 6px",border:"1.5px solid #1b7a4a",borderRadius:20,background:"#e8f7ef",color:"#1b7a4a",fontSize:12,fontWeight:700,cursor:"pointer"}}>✓ Cobrar</button>}
                  <button onClick={()=>generarYCompartirComprobante(v,products)} style={{flex:1,padding:"7px 6px",border:"none",borderRadius:20,background:"#25D366",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                    <img src="/WhatsApp_icon.png" style={{width:16,height:16,objectFit:"contain"}} onError={e=>e.target.style.display="none"}/> Enviar
                  </button>
                  <button onClick={()=>setEditando(v)} style={{width:34,height:34,border:"1.5px solid #1565c0",borderRadius:20,background:"#e3f0ff",color:"#1565c0",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✏️</button>
                  <button onClick={()=>delVenta(v.id)} style={{width:34,height:34,border:"1.5px solid #c0392b",borderRadius:20,background:"transparent",color:"#c0392b",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>🗑</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {showModal&&<ModalVenta products={products} stockProductos={stockProductos} onClose={()=>setShowModal(false)}
        onSave={async d=>{
          await apiFetch.post("/ventas",d);
          for(const it of (d.items||[])){
            const sp=stockProductos.find(s=>String(s.prodId)===String(it.pid));
            if(sp){const nuevoLitros=Math.max(0,(sp.litros||0)-(it.lt||0));await apiFetch.put(`/stock/${sp.id}`,{...sp,litros:nuevoLitros});}
          }
          setShowModal(false);onRefresh();showToast(`Venta S/${parseFloat(d.items.reduce((s,it)=>s+(it.lt||0)*(it.pr||0),0)+(d.delivery||0)).toFixed(2)} registrada ✓`);
        }}/>}
      {editando&&<ModalEditarVenta venta={editando} products={products} onClose={()=>setEditando(null)}
        onSave={async d=>{
          await apiFetch.put(`/ventas/${editando.id}`,d);
          setEditando(null);onRefresh();showToast("Venta actualizada ✓");
        }}/>}
    </div>
  );
}

// ──────── MODAL VENTA MULTI-PRODUCTO ─────────────────────────
function ModalVenta({products,stockProductos,onClose,onSave}){
  const [cli,setCli]=useState("");
  const [pago,setPago]=useState("pagado");
  const [delivery,setDelivery]=useState(0);
  const [nt,setNt]=useState("");
  // Lista de items: [{pid, pn, lt, pr}]
  const [items,setItems]=useState([{pid:String(products[0]?.id||""),pn:products[0]?.n||products[0]?.name||"",lt:"",pr:products[0]?.pv||""}]);

  function setItem(i,field,val){
    setItems(prev=>prev.map((it,idx)=>{
      if(idx!==i)return it;
      if(field==="pid"){
        const p=products.find(x=>String(x.id)===String(val));
        return{...it,pid:val,pn:p?.n||p?.name||"",pr:p?.pv||""};
      }
      return{...it,[field]:val};
    }));
  }
  function addItem(){
    const p=products[0];
    setItems(prev=>[...prev,{pid:String(p?.id||""),pn:p?.n||p?.name||"",lt:"",pr:p?.pv||""}]);
  }
  function removeItem(i){if(items.length===1)return;setItems(prev=>prev.filter((_,idx)=>idx!==i))}

  const subtotal=items.reduce((s,it)=>(s+(parseFloat(it.lt)||0)*(parseFloat(it.pr)||0)),0);
  const totalFinal=subtotal+(parseFloat(delivery)||0);

  function save(){
    if(!cli.trim())return alert("Ingresa el cliente");
    for(const it of items){
      if(!parseFloat(it.lt))return alert("Ingresa litros en todos los productos");
    }
    const itemsFinal=items.map(it=>{
      const p=products.find(x=>String(x.id)===String(it.pid));
      return{pid:it.pid,pn:it.pn||p?.n||p?.name||"—",lt:parseFloat(it.lt),pr:parseFloat(it.pr)||0};
    });
    onSave({cli,items:itemsFinal,delivery:parseFloat(delivery)||0,pago,cobrado:pago==="pagado",nt,ts:Date.now()});
  }

  return(
    <ModalShell title="Registrar venta" onClose={onClose}>
      <Field label="Cliente">
        <input value={cli} onChange={e=>setCli(e.target.value)} placeholder="Nombre del cliente" style={IS}/>
      </Field>

      {/* Items */}
      <div style={{marginBottom:10}}>
        <div style={{fontSize:11,fontWeight:700,color:"#4a5d7a",textTransform:"uppercase",letterSpacing:".05em",marginBottom:6}}>Productos</div>
        {items.map((it,i)=>{
          const stockDisp=stockProductos.find(s=>String(s.prodId)===String(it.pid));
          return(
            <div key={i} style={{background:"#f8fbff",border:"1.5px solid #e3f0ff",borderRadius:10,padding:"10px",marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                <select value={it.pid} onChange={e=>setItem(i,"pid",e.target.value)} style={{...IS,marginBottom:0,flex:1}}>
                  {products.map(p=><option key={p.id} value={String(p.id)}>{p.ico||p.emoji||"🧴"} {p.n||p.name}</option>)}
                </select>
                {items.length>1&&<button onClick={()=>removeItem(i)} style={{width:30,height:30,borderRadius:8,border:"1.5px solid #f5c6c2",background:"#fdf0ef",color:"#c0392b",cursor:"pointer",fontSize:16,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>}
              </div>
              {stockDisp&&<div style={{fontSize:11,color:"#0d7377",fontWeight:700,marginBottom:6}}>📦 Stock disponible: {stockDisp.litros}L</div>}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <div>
                  <div style={{fontSize:10,color:"#4a5d7a",fontWeight:700,marginBottom:3}}>LITROS</div>
                  <input type="number" value={it.lt} onChange={e=>setItem(i,"lt",e.target.value)} placeholder="0" inputMode="decimal" style={IS}/>
                </div>
                <div>
                  <div style={{fontSize:10,color:"#4a5d7a",fontWeight:700,marginBottom:3}}>S/ POR LITRO</div>
                  <input type="number" value={it.pr} onChange={e=>setItem(i,"pr",e.target.value)} placeholder="0" inputMode="decimal" style={IS}/>
                </div>
              </div>
              {parseFloat(it.lt)>0&&parseFloat(it.pr)>0&&(
                <div style={{textAlign:"right",fontSize:12,color:"#1b7a4a",fontWeight:700,marginTop:4}}>
                  = S/{f2((parseFloat(it.lt)||0)*(parseFloat(it.pr)||0))}
                </div>
              )}
            </div>
          );
        })}
        <button onClick={addItem} style={{width:"100%",padding:"8px",background:"transparent",border:"1.5px dashed #c4d4e8",borderRadius:8,color:"#1565c0",fontSize:13,fontWeight:600,cursor:"pointer"}}>
          + Agregar otro producto
        </button>
      </div>

      {/* Tipo de pago */}
      <Field label="Tipo de pago">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {[["pagado","✓ Pagado","#1b7a4a","#e8f7ef"],["fiado","⚠️ Fiado","#c0392b","#fdf0ef"]].map(([k,l,c,bg])=>(
            <button key={k} onClick={()=>setPago(k)} style={{padding:"10px",borderRadius:8,border:`1.5px solid ${pago===k?c:"#c4d4e8"}`,background:pago===k?bg:"transparent",color:pago===k?c:"#4a5d7a",fontSize:13,fontWeight:700,cursor:"pointer"}}>{l}</button>
          ))}
        </div>
      </Field>

      <Field label="Delivery adicional (S/)">
        <input type="number" value={delivery} onChange={e=>setDelivery(e.target.value)} placeholder="0" inputMode="decimal" min="0" style={IS}/>
      </Field>
      <Field label="Notas">
        <input value={nt} onChange={e=>setNt(e.target.value)} placeholder="Opcional" style={IS}/>
      </Field>

      {/* Preview total */}
      {subtotal>0&&(
        <div style={{background:pago==="fiado"?"#fdf0ef":"#e8f7ef",border:`1.5px solid ${pago==="fiado"?"#c0392b":"#1b7a4a"}`,borderRadius:8,padding:"10px 12px",marginBottom:10}}>
          <div style={{fontSize:10,color:pago==="fiado"?"#c0392b":"#1b7a4a",fontWeight:700,textTransform:"uppercase",marginBottom:2}}>{pago==="fiado"?"Total a fiar":"Total a cobrar"}</div>
          <div style={{fontSize:26,fontWeight:800,color:pago==="fiado"?"#c0392b":"#1b7a4a",fontFamily:"monospace"}}>S/{f2(totalFinal)}</div>
          {parseFloat(delivery)>0&&<div style={{fontSize:11,color:"#b45309",marginTop:2}}>Incluye delivery S/{f2(delivery)}</div>}
        </div>
      )}

      <BtnPrimary onClick={save} color={pago==="fiado"?"#c0392b":"#1565c0"}>
        {pago==="fiado"?"Registrar como fiado":"Registrar venta"}
      </BtnPrimary>
      <BtnSecondary onClick={onClose}>Cancelar</BtnSecondary>
    </ModalShell>
  );
}


// ──────── BALANCE ─────────────────────────────────────────────
function PgBalance({ventas,products}){
  const hoy=new Date();
  const hoyStr=hoy.toLocaleDateString("es-PE",{day:"2-digit",month:"short",year:"2-digit"});

  // Agrupar ventas por día
  const porDia={};
  ventas.forEach(v=>{
    const d=new Date(v.ts||v.id);
    const key=d.toLocaleDateString("es-PE",{day:"2-digit",month:"short",year:"2-digit"});
    if(!porDia[key])porDia[key]={fecha:key,total:0,ventas:0,ts:v.ts||v.id};
    porDia[key].total+=ventaTotalReal(v);
    porDia[key].ventas+=1;
  });
  const diasOrdenados=Object.values(porDia).sort((a,b)=>b.ts-a.ts);

  // Total general solo de ventas cobradas/pagadas
  const totCobrado=ventas.filter(v=>v.pago==="pagado"||v.cobrado).reduce((s,v)=>s+ventaTotalReal(v),0);
  const totFiado=ventas.filter(v=>v.pago==="fiado"&&!v.cobrado).reduce((s,v)=>s+ventaTotalReal(v),0);
  const totGeneral=ventas.reduce((s,v)=>s+ventaTotalReal(v),0);

  // Productos más vendidos
  const contProd={};
  ventas.forEach(v=>{
    (v.items||[]).forEach(it=>{
      const key=it.pn||it.pid;
      if(!contProd[key])contProd[key]={nombre:it.pn||"—",litros:0,ingresos:0};
      contProd[key].litros+=(it.lt||0);
      contProd[key].ingresos+=(it.lt||0)*(it.pr||0);
    });
    if(v.pid&&!v.items){
      const p=products.find(x=>String(x.id)===String(v.pid));
      const key=v.pn||v.pid;
      if(!contProd[key])contProd[key]={nombre:v.pn||p?.n||"—",litros:0,ingresos:0};
      contProd[key].litros+=(v.lt||v.litros||0);
      contProd[key].ingresos+=(v.lt||0)*(v.pr||0);
    }
  });
  const topProds=Object.values(contProd).sort((a,b)=>b.litros-a.litros).slice(0,5);

  // Clientes frecuentes
  const contCli={};
  ventas.forEach(v=>{
    const cli=v.cli||v.cliente||"—";
    if(!contCli[cli])contCli[cli]={nombre:cli,compras:0,total:0};
    contCli[cli].compras+=1;
    contCli[cli].total+=ventaTotalReal(v);
  });
  const topCli=Object.values(contCli).sort((a,b)=>b.compras-a.compras).slice(0,5);

  return(
    <div style={{paddingBottom:76}}>
      <div style={{padding:"14px 16px 10px",background:"#fff",borderBottom:"1px solid #dce6f0",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 10px rgba(21,101,192,.07)"}}>
        <div style={{fontSize:20,fontWeight:800}}>Balance</div>
        <div style={{fontSize:12,color:"#4a5d7a",marginTop:1}}>{ventas.length} ventas registradas</div>
      </div>

      {/* Resumen total */}
      <div style={{padding:"12px 16px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        {[
          {lbl:"Total general",val:`S/${f2(totGeneral)}`,c:"#1565c0",bg:"#e3f0ff"},
          {lbl:"Cobrado",val:`S/${f2(totCobrado)}`,c:"#1b7a4a",bg:"#e8f7ef"},
          {lbl:"Fiado pendiente",val:`S/${f2(totFiado)}`,c:"#c0392b",bg:"#fdf0ef"},
        ].map(({lbl,val,c,bg})=>(
          <div key={lbl} style={{background:bg,borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
            <div style={{fontSize:13,fontWeight:800,fontFamily:"monospace",color:c}}>{val}</div>
            <div style={{fontSize:9,color:c,fontWeight:700,textTransform:"uppercase",marginTop:2,opacity:.8}}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Ventas por día */}
      <div style={{padding:"0 16px 8px"}}>
        <div style={{fontSize:10,fontWeight:800,color:"#8a9ab8",letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>Ventas por día</div>
        {diasOrdenados.length===0&&<div style={{textAlign:"center",padding:"20px",color:"#8a9ab8",fontSize:13}}>Sin ventas aún.</div>}
        {diasOrdenados.map(d=>(
          <div key={d.fecha} style={{background:"#fff",border:"1px solid #dce6f0",borderRadius:10,padding:"10px 14px",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:d.fecha===hoyStr?"#1565c0":"#1a2540"}}>{d.fecha===hoyStr?"Hoy":d.fecha}</div>
              <div style={{fontSize:11,color:"#8a9ab8"}}>{d.ventas} venta{d.ventas!==1?"s":""}</div>
            </div>
            <div style={{fontSize:16,fontWeight:800,fontFamily:"monospace",color:"#1b7a4a"}}>S/{f2(d.total)}</div>
          </div>
        ))}
      </div>

      {/* Productos más vendidos */}
      <div style={{padding:"0 16px 8px"}}>
        <div style={{fontSize:10,fontWeight:800,color:"#8a9ab8",letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>Productos más vendidos</div>
        {topProds.length===0&&<div style={{textAlign:"center",padding:"16px",color:"#8a9ab8",fontSize:13}}>Sin datos.</div>}
        {topProds.map((p,i)=>(
          <div key={p.nombre} style={{background:"#fff",border:"1px solid #dce6f0",borderRadius:10,padding:"10px 14px",marginBottom:6,display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:"#e3f0ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"#1565c0",flexShrink:0}}>#{i+1}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700}}>{p.nombre}</div>
              <div style={{fontSize:11,color:"#8a9ab8"}}>{p.litros.toFixed(1)}L vendidos</div>
            </div>
            <div style={{fontSize:14,fontWeight:800,fontFamily:"monospace",color:"#1b7a4a"}}>S/{f2(p.ingresos)}</div>
          </div>
        ))}
      </div>

      {/* Clientes frecuentes */}
      <div style={{padding:"0 16px 8px"}}>
        <div style={{fontSize:10,fontWeight:800,color:"#8a9ab8",letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>Clientes frecuentes</div>
        {topCli.length===0&&<div style={{textAlign:"center",padding:"16px",color:"#8a9ab8",fontSize:13}}>Sin datos.</div>}
        {topCli.map((c,i)=>(
          <div key={c.nombre} style={{background:"#fff",border:"1px solid #dce6f0",borderRadius:10,padding:"10px 14px",marginBottom:6,display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:"#f3e8ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"#6b21a8",flexShrink:0}}>#{i+1}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700}}>{c.nombre}</div>
              <div style={{fontSize:11,color:"#8a9ab8"}}>{c.compras} compra{c.compras!==1?"s":""}</div>
            </div>
            <div style={{fontSize:14,fontWeight:800,fontFamily:"monospace",color:"#1b7a4a"}}>S/{f2(c.total)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────── PROVEEDORES / COMPRAS ───────────────────────────────
function PgProveedores({proveedores,compras,onAddProv,onEditProv,onDelProv,showToast}){
  const totC=compras.reduce((s,c)=>s+montoEnSoles(c),0);
  return(
    <div style={{paddingBottom:76}}>
      <div style={{padding:"14px 16px 10px",background:"#fff",borderBottom:"1px solid #dce6f0",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 10px rgba(21,101,192,.07)"}}>
        <div style={{fontSize:20,fontWeight:800}}>Proveedores</div>
        <div style={{fontSize:12,color:"#4a5d7a",marginTop:1}}>Total comprado: S/{f2(totC)}</div>
      </div>
      <div style={{height:10}}/>
      <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:8}}>
        {proveedores.map(pv=>{
          const tot=compras.filter(c=>c.provId===pv.id).reduce((s,c)=>s+montoEnSoles(c),0);
          return(
            <div key={pv.id} style={{background:"#fff",border:"1px solid #dce6f0",borderRadius:12,padding:"13px 14px",boxShadow:"0 2px 10px rgba(21,101,192,.05)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div><div style={{fontSize:14,fontWeight:800,color:"#0d7377"}}>{pv.nombre}</div><div style={{fontSize:11,color:"#8a9ab8",marginTop:2}}>RUC: {pv.ruc}</div>{pv.telefono&&<div style={{fontSize:11,color:"#4a5d7a",marginTop:1}}>📞 {pv.telefono}</div>}</div>
                <div style={{textAlign:"right"}}><div style={{fontSize:16,fontWeight:800,color:"#1b7a4a",fontFamily:"monospace"}}>S/{f2(tot)}</div></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ──────── PÁGINA FÓRMULAS ────────────────────────────────────
function PgFormulas({products,insumos,setPage,setCurProd,onNewProd}){
  return(
    <div style={{paddingBottom:76}}>
      <div style={{padding:"14px 16px 10px",background:"#fff",borderBottom:"1px solid #dce6f0",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 10px rgba(21,101,192,.07)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:20,fontWeight:800}}>Fórmulas</div>
            <div style={{fontSize:12,color:"#4a5d7a",marginTop:1}}>{products.length} producto{products.length!==1?"s":""}</div>
          </div>
          <button onClick={onNewProd} style={{padding:"7px 14px",border:"1.5px solid #6b21a8",borderRadius:30,background:"#f3e8ff",color:"#6b21a8",fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Nuevo</button>
        </div>
      </div>
      <div style={{height:10}}/>
      <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:8,marginBottom:8}}>
        {products.map(p=>{
          const{cpl,gl,mrg}=calcProd(p,insumos);
          const cl=CL[p.col||"blue"]||CL.blue;
          const pos=gl>=0;
          const ingCount=(p.ings||[]).length;
          return(
            <div key={p.id} onClick={()=>{setCurProd(p);setPage("formula")}} style={{background:"#fff",border:"1.5px solid #dce6f0",borderRadius:12,padding:"13px 14px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",boxShadow:"0 2px 10px rgba(21,101,192,.07)"}}>
              <div style={{width:46,height:46,borderRadius:12,background:cl.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{p.ico||p.emoji||"🧴"}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:15,fontWeight:700}}>{p.n||p.name}</div>
                <div style={{fontSize:11,color:"#8a9ab8",marginTop:2}}>{ingCount} ingrediente{ingCount!==1?"s":""} · {p.lt||p.customLiters||1}L base</div>
                <div style={{fontSize:11,color:"#4a5d7a",marginTop:1,fontFamily:"monospace"}}>Costo S/{parseFloat(cpl).toFixed(2)}/L · Venta S/{parseFloat(p.pv||0).toFixed(2)}/L</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                <span style={{padding:"3px 9px",borderRadius:30,fontSize:11,fontWeight:700,background:pos?"#e8f7ef":"#fdf0ef",color:pos?"#1b7a4a":"#c0392b",fontFamily:"monospace"}}>{pos?"+":""}{mrg.toFixed(0)}%</span>
                <span style={{color:"#8a9ab8",fontSize:16}}>›</span>
              </div>
            </div>
          );
        })}
        {products.length===0&&<div style={{textAlign:"center",padding:"36px 20px",color:"#8a9ab8",fontSize:14}}>Sin productos.<br/>Toca "+ Nuevo" para crear una fórmula.</div>}
      </div>
    </div>
  );
}

// ──────── MODAL EDITAR VENTA ──────────────────────────────────
function ModalEditarVenta({venta,products,onClose,onSave}){
  const [cli,setCli]=useState(venta.cli||venta.cliente||"");
  const [pago,setPago]=useState(venta.pago||"pagado");
  const [delivery,setDelivery]=useState(venta.delivery||0);
  const [nt,setNt]=useState(venta.nt||"");
  const [cobrado,setCobrado]=useState(venta.cobrado||false);

  // Items: soporta multi-item y legacy
  const initItems=venta.items&&Array.isArray(venta.items)&&venta.items.length>0
    ? venta.items.map(it=>({pid:String(it.pid||""),pn:it.pn||"",lt:String(it.lt||""),pr:String(it.pr||"")}))
    : [{pid:String(venta.pid||venta.productId||""),pn:venta.pn||"",lt:String(venta.lt||venta.litros||""),pr:String(venta.pr||venta.precio||"")}];
  const [items,setItems]=useState(initItems);

  function setItem(i,field,val){
    setItems(prev=>prev.map((it,idx)=>{
      if(idx!==i)return it;
      if(field==="pid"){const p=products.find(x=>String(x.id)===String(val));return{...it,pid:val,pn:p?.n||p?.name||""};}
      return{...it,[field]:val};
    }));
  }
  function addItem(){const p=products[0];setItems(prev=>[...prev,{pid:String(p?.id||""),pn:p?.n||p?.name||"",lt:"",pr:String(p?.pv||"")}]);}
  function removeItem(i){if(items.length===1)return;setItems(prev=>prev.filter((_,idx)=>idx!==i));}

  const subtotal=items.reduce((s,it)=>(s+(parseFloat(it.lt)||0)*(parseFloat(it.pr)||0)),0);
  const totalFinal=subtotal+(parseFloat(delivery)||0);

  function save(){
    if(!cli.trim())return alert("Ingresa el cliente");
    const itemsFinal=items.map(it=>{
      const p=products.find(x=>String(x.id)===String(it.pid));
      return{pid:it.pid,pn:it.pn||p?.n||p?.name||"—",lt:parseFloat(it.lt)||0,pr:parseFloat(it.pr)||0};
    });
    const esCobrado=pago==="pagado"||cobrado;
    onSave({...venta,cli,items:itemsFinal,delivery:parseFloat(delivery)||0,pago,cobrado:esCobrado,nt});
  }

  return(
    <ModalShell title="✏️ Editar venta" onClose={onClose}>
      <Field label="Cliente">
        <input value={cli} onChange={e=>setCli(e.target.value)} placeholder="Nombre del cliente" style={IS}/>
      </Field>

      <div style={{marginBottom:10}}>
        <div style={{fontSize:11,fontWeight:700,color:"#4a5d7a",textTransform:"uppercase",letterSpacing:".05em",marginBottom:6}}>Productos</div>
        {items.map((it,i)=>(
          <div key={i} style={{background:"#f8fbff",border:"1.5px solid #e3f0ff",borderRadius:10,padding:"10px",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
              <select value={it.pid} onChange={e=>setItem(i,"pid",e.target.value)} style={{...IS,marginBottom:0,flex:1}}>
                {products.map(p=><option key={p.id} value={String(p.id)}>{p.ico||p.emoji||"🧴"} {p.n||p.name}</option>)}
              </select>
              {items.length>1&&<button onClick={()=>removeItem(i)} style={{width:30,height:30,borderRadius:8,border:"1.5px solid #f5c6c2",background:"#fdf0ef",color:"#c0392b",cursor:"pointer",fontSize:16,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <div><div style={{fontSize:10,color:"#4a5d7a",fontWeight:700,marginBottom:3}}>LITROS</div><input type="number" value={it.lt} onChange={e=>setItem(i,"lt",e.target.value)} placeholder="0" inputMode="decimal" style={IS}/></div>
              <div><div style={{fontSize:10,color:"#4a5d7a",fontWeight:700,marginBottom:3}}>S/ POR LITRO</div><input type="number" value={it.pr} onChange={e=>setItem(i,"pr",e.target.value)} placeholder="0" inputMode="decimal" style={IS}/></div>
            </div>
          </div>
        ))}
        <button onClick={addItem} style={{width:"100%",padding:"8px",background:"transparent",border:"1.5px dashed #c4d4e8",borderRadius:8,color:"#1565c0",fontSize:13,fontWeight:600,cursor:"pointer"}}>+ Agregar producto</button>
      </div>

      <Field label="Tipo de pago">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {[["pagado","✓ Pagado","#1b7a4a","#e8f7ef"],["fiado","⚠️ Fiado","#c0392b","#fdf0ef"]].map(([k,l,c,bg])=>(
            <button key={k} onClick={()=>{setPago(k);if(k==="pagado")setCobrado(true);else setCobrado(false);}} style={{padding:"10px",borderRadius:8,border:`1.5px solid ${pago===k?c:"#c4d4e8"}`,background:pago===k?bg:"transparent",color:pago===k?c:"#4a5d7a",fontSize:13,fontWeight:700,cursor:"pointer"}}>{l}</button>
          ))}
        </div>
      </Field>

      <Field label="Delivery adicional (S/)">
        <input type="number" value={delivery} onChange={e=>setDelivery(e.target.value)} placeholder="0" inputMode="decimal" min="0" style={IS}/>
      </Field>
      <Field label="Notas">
        <input value={nt} onChange={e=>setNt(e.target.value)} placeholder="Opcional" style={IS}/>
      </Field>

      {subtotal>0&&(
        <div style={{background:"#e8f7ef",border:"1.5px solid #1b7a4a",borderRadius:8,padding:"10px 12px",marginBottom:10}}>
          <div style={{fontSize:10,color:"#1b7a4a",fontWeight:700,textTransform:"uppercase",marginBottom:2}}>Total actualizado</div>
          <div style={{fontSize:26,fontWeight:800,color:"#1b7a4a",fontFamily:"monospace"}}>S/{parseFloat(totalFinal).toFixed(2)}</div>
        </div>
      )}
      <BtnPrimary onClick={save}>Guardar cambios</BtnPrimary>
      <BtnSecondary onClick={onClose}>Cancelar</BtnSecondary>
    </ModalShell>
  );
}

// ──────── LOGIN ───────────────────────────────────────────────
function PgLogin({onLogin}){
  const [user,setUser]=useState("");
  const [pass,setPass]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);

  function handleLogin(){
    setLoading(true);setErr("");
    setTimeout(()=>{
      if(user==="AdminGave"&&pass==="572148477@"){
        sessionStorage.setItem("gave_auth","1");
        onLogin();
      } else {
        setErr("Usuario o contraseña incorrectos");
      }
      setLoading(false);
    },600);
  }

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#1565c0,#0d47a1 55%,#1a237e)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",borderRadius:20,padding:"32px 24px",width:"100%",maxWidth:360,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <img src="/logo1.png" style={{height:60,objectFit:"contain",marginBottom:12}} onError={e=>e.target.style.display="none"}/>
          <div style={{fontSize:22,fontWeight:800,color:"#1565c0"}}>SIONEX</div>
          <div style={{fontSize:12,color:"#8a9ab8",marginTop:4}}>Sistema de gestión</div>
        </div>
        <Field label="Usuario">
          <input value={user} onChange={e=>setUser(e.target.value)} placeholder="Usuario" style={IS} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
        </Field>
        <Field label="Contraseña">
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Contraseña" style={IS} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
        </Field>
        {err&&<div style={{background:"#fdf0ef",border:"1.5px solid #c0392b",borderRadius:8,padding:"8px 12px",color:"#c0392b",fontSize:13,fontWeight:600,marginBottom:10,textAlign:"center"}}>{err}</div>}
        <BtnPrimary onClick={handleLogin}>{loading?"Verificando...":"Ingresar"}</BtnPrimary>
      </div>
    </div>
  );
}

// ──────── APP ROOT ────────────────────────────────────────────
export default function App(){
  const [auth,setAuth]=useState(()=>sessionStorage.getItem("gave_auth")==="1");
  const [page,setPage]=useState("inicio");
  const [products,setProducts]=useState([]);
  const [insumos,setInsumos]=useState([]);
  const [ventas,setVentas]=useState([]);
  const [stockProductos,setStockProductos]=useState([]);
  const [curProd,setCurProd]=useState(null);
  const [showNewProd,setShowNewProd]=useState(false);
  const {toast,show:showToast}=useToast();

  if(!auth)return <PgLogin onLogin={()=>setAuth(true)}/>;

  const [proveedores,setProveedores]=useState(()=>{try{return JSON.parse(localStorage.getItem("gave_proveedores"))||PROVEEDORES_INICIALES}catch{return PROVEEDORES_INICIALES}});
  const [compras,setCompras]=useState(()=>{try{return JSON.parse(localStorage.getItem("gave_compras"))||COMPRAS_INICIALES}catch{return COMPRAS_INICIALES}});

  useEffect(()=>{localStorage.setItem("gave_proveedores",JSON.stringify(proveedores))},[proveedores]);
  useEffect(()=>{localStorage.setItem("gave_compras",JSON.stringify(compras))},[compras]);

  const loadAll=useCallback(async()=>{
    try{
      const [p,i,v,s]=await Promise.all([
        apiFetch.get("/products").catch(()=>[]),
        apiFetch.get("/inventario").catch(()=>[]),
        apiFetch.get("/ventas").catch(()=>[]),
        apiFetch.get("/stock").catch(()=>[]),
      ]);
      setProducts(Array.isArray(p)?p:[]);
      setVentas(Array.isArray(v)?v:[]);
      setStockProductos(Array.isArray(s)?s:[]);
      if(Array.isArray(i)&&i.length===0){
        const creados=[];
        for(const ins of INSUMOS_INICIALES){const nuevo=await apiFetch.post("/inventario",ins);if(nuevo?.id)creados.push(nuevo);}
        setInsumos(creados);
      } else {
        setInsumos(Array.isArray(i)?i:[]);
      }
    }catch(e){console.error("Error cargando datos:",e)}
  },[]);

  useEffect(()=>{loadAll()},[loadAll]);

  const NAV=[
    {id:"inicio",label:"Inicio",icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="21" height="21"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>},
    {id:"formulas",label:"Fórmulas",icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="21" height="21"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18"/></svg>},
    {id:"stock",label:"Stock",icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="21" height="21"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>},
    {id:"inventario",label:"Insumos",icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="21" height="21"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>},
    {id:"ventas",label:"Ventas",icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="21" height="21"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>},
    {id:"balance",label:"Balance",icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="21" height="21"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>},
    {id:"proveedores",label:"Proveed.",icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="21" height="21"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>},
  ];

  return(
    <div style={{minHeight:"100vh",background:"#f0f5fb",color:"#1a2540",fontFamily:"system-ui, sans-serif",overflowX:"hidden"}}>
      {page==="inicio"&&<PgInicio products={products} insumos={insumos} ventas={ventas} compras={compras} stockProductos={stockProductos} setPage={setPage} setCurProd={setCurProd} onNewProd={()=>setShowNewProd(true)}/>}
      {page==="formulas"&&<PgFormulas products={products} insumos={insumos} setPage={setPage} setCurProd={setCurProd} onNewProd={()=>setShowNewProd(true)}/>}
      {page==="stock"&&<PgStock products={products} stockProductos={stockProductos} onRefresh={loadAll} showToast={showToast}/>}
      {page==="formula"&&curProd&&<PgFormula prod={curProd} insumos={insumos} onBack={()=>{setPage("inicio");setCurProd(null);loadAll()}} onRefresh={loadAll} showToast={showToast}/>}
      {page==="inventario"&&<PgInventario insumos={insumos} onRefresh={loadAll} showToast={showToast}/>}
      {page==="ventas"&&<PgVentas ventas={ventas} products={products} stockProductos={stockProductos} onRefresh={loadAll} showToast={showToast}/>}
      {page==="balance"&&<PgBalance ventas={ventas} products={products}/>}
      {page==="proveedores"&&<PgProveedores proveedores={proveedores} compras={compras} onAddProv={d=>setProveedores(p=>[...p,{...d,id:`prov${Date.now()}`}])} onEditProv={(id,d)=>setProveedores(p=>p.map(x=>x.id===id?{...x,...d}:x))} onDelProv={id=>setProveedores(p=>p.filter(x=>x.id!==id))} showToast={showToast}/>}

      {page!=="formula"&&(
        <nav style={{position:"fixed",bottom:0,left:0,right:0,zIndex:200,background:"#fff",borderTop:"1px solid #dce6f0",display:"flex",padding:"6px 0 6px"}}>
          {NAV.map(({id,label,icon})=>(
            <button key={id} onClick={()=>setPage(id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"5px 2px",border:"none",background:"transparent",color:page===id?"#1565c0":"#8a9ab8",fontSize:"9px",fontWeight:700,cursor:"pointer",letterSpacing:".03em",textTransform:"uppercase"}}>
              {icon}{label}
              <div style={{width:4,height:4,borderRadius:"50%",background:"#1565c0",opacity:page===id?1:0,marginTop:-2}}/>
            </button>
          ))}
        </nav>
      )}

      {toast&&<div style={{position:"fixed",bottom:82,left:"50%",transform:"translateX(-50%)",background:toast.ok?"#1b7a4a":"#c0392b",color:"#fff",padding:"10px 20px",borderRadius:30,fontSize:13,fontWeight:700,whiteSpace:"nowrap",zIndex:400,boxShadow:"0 4px 20px rgba(21,101,192,.12)"}}>{toast.msg}</div>}

      {showNewProd&&<ModalProd onClose={()=>setShowNewProd(false)} onSave={async d=>{await apiFetch.post("/products",{...d,ings:[],stock:0});setShowNewProd(false);await loadAll();showToast("Producto creado ✓")}}/>}
    </div>
  );
}
