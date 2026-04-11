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
  const totV=ventas.reduce((s,v)=>s+(v.tot||0),0);
  const totC=compras.reduce((s,c)=>s+montoEnSoles(c),0);
  const fiadas=ventas.filter(v=>v.pago==="fiado"&&!v.cobrado);
  const totFiado=fiadas.reduce((s,v)=>s+(v.tot||0)+(v.delivery||0),0);

  return(
    <div style={{paddingBottom:76}}>
      <div style={{background:"linear-gradient(135deg,#1565c0,#0d47a1 55%,#1a237e)",padding:"22px 16px 18px",color:"#fff"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <div style={{width:46,height:46,borderRadius:14,background:"rgba(255,255,255,.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🧪</div>
          <div><div style={{fontSize:20,fontWeight:800}}>GAVE Producción</div><div style={{fontSize:12,opacity:.75,marginTop:2}}>Control de fórmulas · inventario · ventas</div></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
          {[[products.length,"Productos"],[`S/${Math.round(totV)}` ,"Ventas"],[insumos.length,"Insumos"],[`S/${Math.round(totC)}`,"Compras"]].map(([v,l])=>(
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

      {/* Stock de productos terminados */}
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

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px 8px"}}>
        <div style={{fontSize:10,fontWeight:800,color:"#8a9ab8",letterSpacing:".1em",textTransform:"uppercase"}}>Fórmulas</div>
        <button onClick={onNewProd} style={{padding:"7px 14px",border:"1.5px solid #1565c0",borderRadius:30,background:"#f0f6ff",color:"#1565c0",fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Nuevo</button>
      </div>
      <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:8,marginBottom:8}}>
        {products.map(p=>{
          const{cpl,gl,mrg}=calcProd(p,insumos);
          const cl=CL[p.col||"blue"]||CL.blue,pos=gl>=0;
          return(
            <div key={p.id} onClick={()=>{setCurProd(p);setPage("formula");}} style={{background:"#fff",border:"1px solid #dce6f0",borderRadius:12,padding:13,display:"flex",alignItems:"center",gap:11,cursor:"pointer",boxShadow:"0 2px 10px rgba(21,101,192,.07)"}}>
              <div style={{width:44,height:44,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,background:cl.bg}}>{p.ico||p.emoji||"🧴"}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:15,fontWeight:700}}>{p.n||p.name}</div>
                <div style={{fontSize:11,color:"#4a5d7a",marginTop:2,fontFamily:"monospace"}}>Costo S/{f2(cpl)}/L · Venta S/{f2(p.pv||0)}/L</div>
              </div>
              <span style={{padding:"3px 9px",borderRadius:30,fontSize:11,fontWeight:700,background:pos?"#e8f7ef":"#fdf0ef",color:pos?"#1b7a4a":"#c0392b",fontFamily:"monospace"}}>{pos?"+":""}{mrg.toFixed(0)}%</span>
              <span style={{color:"#8a9ab8",fontSize:18}}>›</span>
            </div>
          );
        })}
        {products.length===0&&<div style={{textAlign:"center",padding:"36px 20px",color:"#8a9ab8",fontSize:14}}>Sin productos aún.<br/>Toca "+ Nuevo" para crear.</div>}
      </div>
    </div>
  );
}

// ──────── STOCK DE PRODUCTOS TERMINADOS ──────────────────────
function PgStock({products,stockProductos,onRefresh,showToast}){
  const [showAdd,setShowAdd]=useState(false);
  const [editItem,setEditItem]=useState(null);

  async function saveStock(data){
    if(data.id){
      await apiFetch.put(`/stock/${data.id}`,data);
    } else {
      await apiFetch.post("/stock",data);
    }
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

  useEffect(()=>{if(prod)setP({...prod,lt:prod.lt||prod.customLiters||1,pv:prod.pv||0,ings:prod.ings||[]})},[prod]);
  if(!p)return null;

  const{tot,cpl,gl,gt,mrg}=calcProd(p,insumos);
  const pos=gl>=0;

  async function patch(data){const updated={...p,...data};setP(updated);await apiFetch.put(`/products/${p.id}`,data);onRefresh()}
  async function onCant(i,v){const t=parseFloat(v)||0;const newIngs=p.ings.map((ing,idx)=>idx===i?{...ing,c:p.lt>0?t/p.lt:t}:ing);await patch({ings:newIngs})}
  async function onIns(i,sidStr){const sid=parseInt(sidStr);const s=insumos.find(x=>x.id===sid);const newIngs=p.ings.map((ing,idx)=>idx===i?{...ing,sid,env:s?.env||false}:ing);await patch({ings:newIngs})}
  async function delIng(i){await patch({ings:p.ings.filter((_,idx)=>idx!==i)})}
  async function addIng(){await patch({ings:[...p.ings,{sid:insumos[0]?.id||1,c:10,u:"g"}]})}

  return(
    <div style={{paddingBottom:76}}>
      <div style={{background:"#fff",padding:"12px 16px",borderBottom:"1px solid #dce6f0",display:"flex",alignItems:"center",gap:10,position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 10px rgba(21,101,192,.07)"}}>
        <button onClick={onBack} style={{width:36,height:36,borderRadius:10,border:"1.5px solid #c4d4e8",background:"#e5edf7",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#4a5d7a",fontSize:20}}>‹</button>
        <span style={{fontSize:24}}>{p.ico||p.emoji||"🧴"}</span>
        <div style={{flex:1}}><div style={{fontSize:17,fontWeight:800}}>{p.n||p.name}</div><div style={{fontSize:11,color:"#4a5d7a"}}>{p.ings.length} ingredientes · {p.lt}L</div></div>
        <button onClick={()=>setEditingProd(true)} style={{padding:"7px 14px",border:"1.5px solid #1565c0",borderRadius:30,background:"#f0f6ff",color:"#1565c0",fontSize:12,fontWeight:700,cursor:"pointer"}}>⚙️</button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,padding:"10px 16px",background:"#f0f6ff",borderBottom:"1px solid #e3f0ff"}}>
        {[{lbl:"Litros a preparar",val:p.lt,unit:"litros totales del lote",cb:v=>patch({lt:parseFloat(v)||1,customLiters:parseFloat(v)||1})},{lbl:"Precio venta S/",val:p.pv,unit:"por litro",cb:v=>patch({pv:parseFloat(v)||0})}].map(({lbl,val,unit,cb})=>(
          <div key={lbl} style={{background:"#fff",border:"1.5px solid #e3f0ff",borderRadius:8,padding:"10px 12px"}}>
            <div style={{fontSize:10,color:"#1565c0",fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",marginBottom:3}}>{lbl}</div>
            <input key={val} type="number" defaultValue={val} min="0" step="0.5" inputMode="decimal"
              onBlur={e=>cb(e.target.value)} onKeyDown={e=>e.key==="Enter"&&cb(e.target.value)}
              style={{width:"100%",background:"transparent",border:"none",color:"#1565c0",fontFamily:"monospace",fontSize:20,fontWeight:600,outline:"none",padding:0}}/>
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
                  {!isE?(<input key={`${i}-${p.lt}`} type="number" defaultValue={parseFloat((ing.c*p.lt*1000).toFixed(1))} step="1" min="0" inputMode="decimal"
                    onBlur={e=>onCant(i,(parseFloat(e.target.value)||0)/1000)} onKeyDown={e=>e.key==="Enter"&&onCant(i,(parseFloat(e.target.value)||0)/1000)}
                    style={{width:60,background:"#e5edf7",border:"1.5px solid #c4d4e8",borderRadius:6,color:"#1a2540",fontFamily:"monospace",fontSize:14,fontWeight:600,textAlign:"right",padding:"4px 5px",outline:"none"}}/>
                  ):<span style={{fontSize:13,color:"#4a5d7a",fontFamily:"monospace"}}>1</span>}
                  <span style={{fontSize:11,color:"#8a9ab8",minWidth:16}}>{isE?"u/lote":"g"}</span>
                </div>
                <button onClick={()=>delIng(i)} style={{width:28,height:28,borderRadius:6,border:"1.5px solid #dce6f0",background:"transparent",color:"#8a9ab8",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
              </div>
              <div style={{padding:"5px 12px 9px",borderTop:"1px solid #dce6f0"}}>
                <select value={ing.sid} onChange={e=>onIns(i,e.target.value)} style={{width:"100%",background:"#e5edf7",border:"1.5px solid #c4d4e8",borderRadius:6,color:"#4a5d7a",fontSize:12,padding:"6px 7px",outline:"none"}}>
                  {insumos.map(s=><option key={s.id} value={s.id}>{s.n||s.insumo} — {s.prov||"—"}</option>)}
                </select>
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={addIng} style={{margin:"2px 16px 6px",width:"calc(100% - 32px)",padding:11,background:"transparent",border:"1.5px dashed #c4d4e8",borderRadius:8,color:"#8a9ab8",fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
        + Agregar insumo
      </button>

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

      {editingProd&&<ModalProd prod={p}
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

// ──────── VENTAS ─────────────────────────────────────────────
function PgVentas({ventas,products,stockProductos,onRefresh,showToast}){
  const [showModal,setShowModal]=useState(false);
  const [filtro,setFiltro]=useState("todas"); // todas | fiado | pagado
  const totV=ventas.reduce((s,v)=>s+(v.tot||0)+(v.delivery||0),0);
  const totFiado=ventas.filter(v=>v.pago==="fiado"&&!v.cobrado).reduce((s,v)=>s+(v.tot||0)+(v.delivery||0),0);

  async function delVenta(id){if(!confirm("¿Borrar esta venta?"))return;await apiFetch.del(`/ventas/${id}`);onRefresh();showToast("Eliminado")}
  async function marcarCobrado(v){await apiFetch.put(`/ventas/${v.id}`,{...v,cobrado:true});onRefresh();showToast("Marcado como cobrado ✓")}

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
        {/* Filtros */}
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
          const p=products.find(x=>String(x.id)===String(v.pid)||String(x.id)===String(v.productId));
          const cl=CL[p?.col||"blue"]||CL.blue;
          const esFiado=v.pago==="fiado";
          const cobrado=v.cobrado;
          const borderColor=esFiado&&!cobrado?"#c0392b":"#dce6f0";
          const totalConDelivery=(v.tot||0)+(v.delivery||0);
          return(
            <div key={v.id} style={{background:"#fff",border:`1.5px solid ${borderColor}`,borderRadius:12,padding:"12px 14px",boxShadow:"0 2px 10px rgba(21,101,192,.07)"}}>
              {/* Header */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{fontSize:14,fontWeight:700}}>{v.cli||v.cliente||"—"}</span>
                <span style={{fontSize:11,color:"#8a9ab8",fontFamily:"monospace"}}>{fDate(v.ts||v.id)}</span>
              </div>
              {/* Tags */}
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:8}}>
                <span style={{padding:"2px 8px",borderRadius:30,fontSize:11,fontWeight:600,background:cl.bg,color:cl.t}}>{p?.ico||p?.emoji||""} {v.pn||p?.n||p?.name||"—"}</span>
                <span style={{padding:"2px 8px",borderRadius:30,fontSize:11,fontWeight:600,background:"#e3f0ff",color:"#1565c0"}}>{v.lt||v.litros||0}L</span>
                {/* Estado de pago */}
                <span style={{padding:"2px 8px",borderRadius:30,fontSize:11,fontWeight:700,background:esFiado&&!cobrado?"#fdf0ef":cobrado?"#e8f7ef":"#e8f7ef",color:esFiado&&!cobrado?"#c0392b":"#1b7a4a"}}>
                  {esFiado&&!cobrado?"⚠️ Fiado":cobrado?"✓ Cobrado":"✓ Pagado"}
                </span>
                {/* Delivery */}
                {v.delivery>0&&<span style={{padding:"2px 8px",borderRadius:30,fontSize:11,fontWeight:600,background:"#fef3e2",color:"#b45309"}}>🛵 Delivery S/{f2(v.delivery)}</span>}
                {v.nt&&<span style={{padding:"2px 8px",borderRadius:30,fontSize:11,fontWeight:600,background:"#e5edf7",color:"#4a5d7a"}}>{v.nt}</span>}
              </div>
              {/* Footer */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:12,color:"#4a5d7a",fontFamily:"monospace"}}>S/{f2(v.pr||v.precio||0)}/L</span>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:16,fontWeight:800,color:esFiado&&!cobrado?"#c0392b":"#1b7a4a",fontFamily:"monospace"}}>S/{f2(totalConDelivery)}</span>
                  {esFiado&&!cobrado&&<button onClick={()=>marcarCobrado(v)} style={{padding:"4px 10px",border:"1.5px solid #1b7a4a",borderRadius:30,background:"#e8f7ef",color:"#1b7a4a",fontSize:11,fontWeight:700,cursor:"pointer"}}>Cobrar</button>}
                  <button onClick={()=>delVenta(v.id)} style={{padding:"4px 10px",border:"1.5px solid #c0392b",borderRadius:30,background:"transparent",color:"#c0392b",fontSize:11,fontWeight:700,cursor:"pointer"}}>Borrar</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {showModal&&<ModalVenta products={products} stockProductos={stockProductos} onClose={()=>setShowModal(false)}
        onSave={async d=>{
          await apiFetch.post("/ventas",d);
          // Descontar del stock si hay stock registrado
          if(d.pid){
            const sp=stockProductos.find(s=>String(s.prodId)===String(d.pid));
            if(sp){
              const nuevoLitros=Math.max(0,(sp.litros||0)-(d.lt||0));
              await apiFetch.put(`/stock/${sp.id}`,{...sp,litros:nuevoLitros});
            }
          }
          setShowModal(false);onRefresh();showToast(`Venta S/${f2((d.tot||0)+(d.delivery||0))} registrada ✓`);
        }}/>}
    </div>
  );
}

function ModalVenta({products,stockProductos,onClose,onSave}){
  const [cli,setCli]=useState("");
  const [pid,setPid]=useState(String(products[0]?.id||""));
  const [lt,setLt]=useState("");
  const [pr,setPr]=useState(products[0]?.pv||"");
  const [nt,setNt]=useState("");
  const [pago,setPago]=useState("pagado"); // pagado | fiado
  const [delivery,setDelivery]=useState(0);
  const tot=(parseFloat(lt)||0)*(parseFloat(pr)||0);
  const totalFinal=tot+(parseFloat(delivery)||0);

  function handleProd(v){setPid(v);const p=products.find(x=>String(x.id)===String(v));if(p)setPr(p.pv||0)}

  const stockDisp=stockProductos.find(s=>String(s.prodId)===String(pid));

  function save(){
    if(!cli.trim())return alert("Ingresa el cliente");
    if(!parseFloat(lt))return alert("Ingresa litros vendidos");
    if(stockDisp&&parseFloat(lt)>(stockDisp.litros||0)){if(!confirm(`Solo hay ${stockDisp.litros}L en stock. ¿Continuar de todas formas?`))return}
    const p=products.find(x=>String(x.id)===String(pid));
    onSave({cli,pid,pn:p?.n||p?.name||"—",lt:parseFloat(lt),pr:parseFloat(pr)||0,tot,delivery:parseFloat(delivery)||0,pago,cobrado:pago==="pagado",nt,ts:Date.now()});
  }

  return(
    <ModalShell title="Registrar venta" onClose={onClose}>
      <Field label="Cliente"><input value={cli} onChange={e=>setCli(e.target.value)} placeholder="Nombre del cliente" style={IS}/></Field>
      <Field label="Producto">
        <select value={pid} onChange={e=>handleProd(e.target.value)} style={IS}>
          {products.map(p=><option key={p.id} value={String(p.id)}>{p.ico||p.emoji||"🧴"} {p.n||p.name}</option>)}
        </select>
      </Field>
      {/* Stock disponible */}
      {stockDisp&&<div style={{background:"#e0f5f5",border:"1.5px solid #0d7377",borderRadius:8,padding:"8px 12px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:12,color:"#0d7377",fontWeight:700}}>Stock disponible</span>
        <span style={{fontSize:16,fontWeight:800,color:"#0d7377",fontFamily:"monospace"}}>{stockDisp.litros}L</span>
      </div>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
        <Field label="Litros vendidos"><input type="number" value={lt} onChange={e=>setLt(e.target.value)} placeholder="1" inputMode="decimal" style={IS}/></Field>
        <Field label="Precio / litro (S/)"><input type="number" value={pr} onChange={e=>setPr(e.target.value)} placeholder="10" inputMode="decimal" style={IS}/></Field>
      </div>
      {/* Tipo de pago */}
      <Field label="Tipo de pago">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {[["pagado","✓ Pagado","#1b7a4a","#e8f7ef"],["fiado","⚠️ Fiado","#c0392b","#fdf0ef"]].map(([k,l,c,bg])=>(
            <button key={k} onClick={()=>setPago(k)} style={{padding:"10px",borderRadius:8,border:`1.5px solid ${pago===k?c:"#c4d4e8"}`,background:pago===k?bg:"transparent",color:pago===k?c:"#4a5d7a",fontSize:13,fontWeight:700,cursor:"pointer"}}>{l}</button>
          ))}
        </div>
      </Field>
      {/* Delivery */}
      <Field label="Delivery adicional (S/)">
        <input type="number" value={delivery} onChange={e=>setDelivery(e.target.value)} placeholder="0" inputMode="decimal" min="0" style={IS}/>
      </Field>
      <Field label="Notas"><input value={nt} onChange={e=>setNt(e.target.value)} placeholder="Opcional" style={IS}/></Field>
      {/* Preview total */}
      {parseFloat(lt)>0&&parseFloat(pr)>0&&(
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

// ──────── PROVEEDORES / COMPRAS (simplificado) ────────────────
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

// ──────── APP ROOT ────────────────────────────────────────────
export default function App(){
  const [page,setPage]=useState("inicio");
  const [products,setProducts]=useState([]);
  const [insumos,setInsumos]=useState([]);
  const [ventas,setVentas]=useState([]);
  const [stockProductos,setStockProductos]=useState([]);
  const [curProd,setCurProd]=useState(null);
  const [showNewProd,setShowNewProd]=useState(false);
  const {toast,show:showToast}=useToast();

  const [proveedores,setProveedores]=useState(()=>{try{return JSON.parse(localStorage.getItem("gave_proveedores"))||PROVEEDORES_INICIALES}catch{return PROVEEDORES_INICIALES}});
  const [compras,setCompras]=useState(()=>{try{return JSON.parse(localStorage.getItem("gave_compras"))||COMPRAS_INICIALES}catch{return COMPRAS_INICIALES}});

  useEffect(()=>{localStorage.setItem("gave_proveedores",JSON.stringify(proveedores))},[proveedores]);
  useEffect(()=>{localStorage.setItem("gave_compras",JSON.stringify(compras))},[compras]);

  const loadAll=useCallback(async()=>{
    try{
      const [p,i,v,s]=await Promise.all([apiFetch.get("/products"),apiFetch.get("/inventario"),apiFetch.get("/ventas"),apiFetch.get("/stock")]);
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
    {id:"stock",label:"Stock",icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="21" height="21"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>},
    {id:"inventario",label:"Insumos",icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="21" height="21"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>},
    {id:"ventas",label:"Ventas",icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="21" height="21"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>},
    {id:"proveedores",label:"Proveed.",icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="21" height="21"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>},
  ];

  return(
    <div style={{minHeight:"100vh",background:"#f0f5fb",color:"#1a2540",fontFamily:"system-ui, sans-serif",overflowX:"hidden"}}>
      {page==="inicio"&&<PgInicio products={products} insumos={insumos} ventas={ventas} compras={compras} stockProductos={stockProductos} setPage={setPage} setCurProd={setCurProd} onNewProd={()=>setShowNewProd(true)}/>}
      {page==="stock"&&<PgStock products={products} stockProductos={stockProductos} onRefresh={loadAll} showToast={showToast}/>}
      {page==="formula"&&curProd&&<PgFormula prod={curProd} insumos={insumos} onBack={()=>{setPage("inicio");setCurProd(null);loadAll()}} onRefresh={loadAll} showToast={showToast}/>}
      {page==="inventario"&&<PgInventario insumos={insumos} onRefresh={loadAll} showToast={showToast}/>}
      {page==="ventas"&&<PgVentas ventas={ventas} products={products} stockProductos={stockProductos} onRefresh={loadAll} showToast={showToast}/>}
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
