/* ----------------------------- Datos iniciales ----------------------------- */
  const productos = [
    {id:'p1',name:'Sushi Mix 12 piezas',categoria:'platos',precio:12.5,desc:'Nigiri y maki surtidos',img:'imagenes/platos/12_mix.jpg'},
    {id:'p2',name:'Tempura Roll',categoria:'platos',precio:9.0,desc:'Roll crujiente con tempura',img:'imagenes/platos/tempura_roll.jpg'},
    {id:'p3',name:'California Roll',categoria:'platos',precio:8.5,desc:'Aguacate y cangrejo',img:'imagenes/platos/california_roll.png'},
    {id:'p4',name:'Poké Bowl',categoria:'platos',precio:10.5,desc:'Arroz, atún marinado y toppings',img:'imagenes/platos/poke.jpg'},
	{id:'p5',name:'Maki 4 piezas',categoria:'platos',precio:6.0,desc:'Arroz, aguacate y alga',img:'imagenes/platos/maki.jpg'},
	{id:'p6',name:'Nigiri 4 piezas',categoria:'platos',precio:6.0,desc:'Arroz y pez mantuequilla',img:'imagenes/platos/nigiri.jpg'},
	{id:'p7',name:'Sashimi',categoria:'platos',precio:11.0,desc:'atún, salmón y pulpo',img:'imagenes/platos/sashimi.jpg'},
	{id:'p8',name:'Tartar',categoria:'platos',precio:10.5,desc:'Atun o Salmon',img:'imagenes/platos/tartar.jpg'},
    {id:'b1',name:'Agua 500ml',categoria:'bebidas',precio:1.5,desc:'Agua mineral embotellada o de grifo',img:'imagenes/bebidas/agua.jpg'},
    {id:'b2',name:'Refresco 330ml',categoria:'bebidas',precio:2.0,desc:'Lata refrigerada de ColaLoca, Llanta de Naranja, Noesté, Aguarrius y Sepsi',img:'imagenes/bebidas/refrescos.jpg'},
	{id:'b3',name:'Sake 500ml',categoria:'bebidas',precio:8.5,desc:'Sake japones',img:'imagenes/bebidas/sake.jpg'},
	{id:'b4',name:'Estrella Galicia 300ml',categoria:'bebidas',precio:3.0,desc:'Cerveza para la cabeza',img:'imagenes/bebidas/cerveza.jpg'},
	{id:'b5',name:'Té macha',categoria:'bebidas',precio:3.5,desc:'Té tradicional',img:'imagenes/bebidas/té.jpg'},
    {id:'post1',name:'Mochi Matcha',categoria:'postres',precio:3.5,desc:'Mochi relleno de helado',img:'imagenes/postres/mochi.jpg'},
    {id:'post2',name:'Dorayaki',categoria:'postres',precio:2.8,desc:'Pastel japonés relleno',img:'imagenes/postres/dorayakis.jpg'},
	{id:'post3',name:'Mitarashi dango',categoria:'postres',precio:5.0,desc:'Brocheta de bambú con diversas bolas de masa dulce',img:'imagenes/postres/dango.jpg'},
	{id:'post4',name:'Momiji Manjû',categoria:'postres',precio:6.0,desc:'Pastelitos de huevos, azúcar, almíbar y azúcar granuladoonés relleno',img:'imagenes/postres/manju.jpg'},
	{id:'post5',name:'Taiyaki',categoria:'postres',precio:4.5,desc:'dulce de harina de trigo relleno de frijoles rojos hervidos y mezclado con azúcar',img:'imagenes/postres/taiyaki.jpg'}
  ];

  const restaurantes = [
    {name:'SushiGo Centro',direccion:'Calle Mayor, 12, 28013 Madrid',phone:'+34 91 123 45 67'},
    {name:'SushiGo Salamanca',direccion:'Calle de Serrano, 54, 28006 Madrid',phone:'+34 91 234 56 78'},
    {name:'SushiGo Vallecas',direccion:'Av. de la Albufera, 120, 28038 Madrid',phone:'+34 91 345 67 89'}
  ];

  /* ----------------------------- Estado y persistencia ----------------------------- */
  const STORAGE_KEY = 'sushigo_cart_v1';
  let carrito = cargarCarrito();
  let promoSemanal = generarPromoSemanal(new Date());

  /* ----------------------------- Inicialización ----------------------------- */
  document.addEventListener('DOMContentLoaded', ()=>{
    bindpestañas();
    renderpestaña('menu');
    renderContadorCarrito();
    setupBotonesCarrito();
  });

  /* ----------------------------- pestañas ----------------------------- */
  function bindpestañas(){
    document.querySelectorAll('.pestaña').forEach(btn=>{
      btn.addEventListener('click', e=>{
        document.querySelectorAll('.pestaña').forEach(t=>t.classList.remove('activa'));
        btn.classList.add('activa');
        const pestaña = btn.dataset.pestaña;
        renderpestaña(pestaña);
      });
    });

    document.getElementById('carrito_abierto').addEventListener('click', openCart);
    document.getElementById('cerrar_carrito').addEventListener('click', cerrarCarrito);
    document.getElementById('aplicar_promo').addEventListener('click', ()=>{
      const codigo = document.getElementById('promo-input').value.trim();
      aplicarPromos(codigo);
    });
    document.getElementById('checkout').addEventListener('click', ()=>{
      if(carrito.items.length === 0) return alert('El carrito está vacío');
      // demo: finalizar compra
	  renderCheckoutForm();
	  cerrarCarrito();
    });

    // close with ESC
    document.addEventListener('keydown', e=>{ if(e.key==='Escape') cerrarCarrito(); });
  }

  
  function renderpestaña(pestaña){
    const main = document.getElementById('main-content');
    main.innerHTML = '';
    if(pestaña==='menu') renderMenu(main);
    else if(pestaña==='promos') renderPromos(main);
    else if(pestaña==='restaurantes') renderRestaurantes(main);
  }
  
  /*...............................Render: Compra-----------------------------*/
  
  function renderCheckoutForm(){
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <h2>Finalizar compra</h2>
      <form id="reparto-form" class="checkout-form">
        <label><input type="radio" name="reparto" value="domicilio" checked> Envío a domicilio</label>
        <div id="direccion-input">
          <input type="text" id="envio-direccion" placeholder="Introduce tu dirección">
        </div>
        <label><input type="radio" name="reparto" value="recogida"> Recogida en restaurante</label>
        <div id="restaurante-elegido" style="display:none">
          <select id="pickup-restaurante">
            ${restaurantes.map((r,i)=>`<option value="${r.direccion}">${r.name} - ${r.direccion}</option>`).join('')}
          </select>
        </div>
        <button type="submit" class="btn add" style="margin-top:12px">Confirmar pedido</button>
      </form>
    `;

    // alternar campos según opción
    main.querySelectorAll('input[name="reparto"]').forEach(r=>{
      r.addEventListener('change', ()=>{
        document.getElementById('direccion-input').style.display = r.value==="domicilio"?"block":"none";
        document.getElementById('restaurante-elegido').style.display = r.value==="recogida"?"block":"none";
      });
    });

    main.querySelector('#reparto-form').addEventListener('submit', e=>{
      e.preventDefault();
      const modo = main.querySelector('input[name="reparto"]:checked').value;
      let direccion = modo==="domicilio" ? document.getElementById('envio-direccion').value.trim()
                                       : document.getElementById('pickup-restaurante').value;
      if(!direccion) return alert("Introduce una dirección o selecciona un restaurante");
      renderOrdenSeguimiento(direccion, modo);
      carrito = {items:[], promoCodeApplied:null};
      guardarCarrito(); 
	  renderContadorCarrito();
    });
  }
  
  /*------------------------------Render:seguimiento--------------------------*/
  function renderOrdenSeguimiento(direccion, modo){
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <h2>Seguimiento de pedido</h2>
      <p>${modo==="domicilio" ? "Enviado a domicilio:" : "Recogida en:"} <strong>${escapeHtml(direccion)}</strong></p>
      <div class="map-contenedor">
        <iframe
          width="100%" height="300" style="border:0" loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=${encodeURIComponent(direccion)}&output=embed"></iframe>
      </div>
      <div class="order-status">
        <div id="status-text">Preparando pedido...</div>
        <div class="status-bar"><div id="status-progreso"></div></div>
      </div>
    `;

    const steps = ["Preparando pedido","Listo para recoger","En reparto","Entregado"];
    let idx = 0;
    const progreso = document.getElementById("status-progreso");
    const text = document.getElementById("status-text");

    function update(){
      text.textContent = steps[idx];
      progreso.style.width = ((idx+1)/steps.length*100)+"%";
      idx++;
      if(idx<steps.length){ setTimeout(update,60000); } // avanza cada minuto
    }
    update();
  }


  /* ----------------------------- Render: Menú ----------------------------- */
  function renderMenu() {
    const main = document.getElementById("main-content");
    main.innerHTML = `
      <div class="categorias">
        <div class="categoria-elegido" data-cat="platos">
          <img src="imagenes/platos.jpg" alt="Platos">
          <h2>Platos</h2>
        </div>
        <div class="categoria-elegido" data-cat="bebidas">
          <img src="imagenes/bebidas.jpg" alt="Bebidas">
          <h2>Bebidas</h2>
        </div>
        <div class="categoria-elegido" data-cat="postres">
          <img src="imagenes/postres.jpg" alt="Postres">
          <h2>Postres</h2>
        </div>
      </div>
    `; 
    document.querySelectorAll(".categoria-elegido").forEach(div=>{
      div.addEventListener("click",()=>{
        const cat = div.dataset.cat;
        renderCategoria(cat);
      });
    });
  }

  function renderCategoria(cat){
    const main = document.getElementById("main-content");
    main.innerHTML = `<h2>${cat.toUpperCase()}</h2><div id="productos"></div>`;
    const productsEl = document.getElementById("productos");
    const items = productos.filter(p=>p.categoria===cat);
    items.forEach(p=>{
      const ficha = document.createElement("div");
      ficha.className="producto-ficha";
      ficha.innerHTML = `
        <div class="producto-thumb">
			<img src="${p.img}" alt"${p.name}">
		</div>
		
        <div class="producto-info">
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <div class="producto-meta">
            <div class="precio">€ ${p.precio.toFixed(2)}</div>
            <button class="btn add" data-id="${p.id}">Añadir</button>
          </div>
        </div>`;
      ficha.querySelector("button").addEventListener("click",()=>añadirACarrito(p.id));
      productsEl.appendChild(ficha);
    });
  }


  /* ----------------------------- Render: Promociones ----------------------------- */
  function renderPromos(contenedor){
    const promo = promoSemanal;
    const el = document.createElement('div'); el.className='promo-ficha';
    el.innerHTML = `
      <h2>Promoción semanal</h2>
      <p class="muted">Cada semana generamos un código 2x1 válido para un producto aleatorio del carrito. El código cambia los lunes.</p>
      <div style="margin-top:12px">
        <div class="promo-codigo" id="promo-codigo">${promo.codigo}</div>
        <div class="muted small" style="margin-top:8px">Válido desde: ${promo.validFrom} hasta ${promo.validTo}</div>
      </div>
      <div style="margin-top:12px">
        <button class="btn" id="copy-promo">Copiar código</button>
      </div>
	  
	  <div style="margin-top:12px">
	          <img src="imagenes/feliz.png" alt="familia feliz" style="margin-left: 110px; width: 800px; height: 296px;">
	  </div>
	  	  
    `;
    contenedor.appendChild(el);
    el.querySelector('#copy-promo').addEventListener('click', ()=>{
      navigator.clipboard?.writeText(promo.codigo).then(()=>alert('Código copiado'));
    });
  }

  /* ----------------------------- Render: Restaurantes ----------------------------- */
  function renderRestaurantes(contenedor){
    const wrapper = document.createElement('div'); wrapper.className='restaurantes';
    restaurantes.forEach(r=>{
      const d = document.createElement('div'); d.className='restaurante';
      d.innerHTML = `<h3>${escapeHtml(r.name)}</h3><div class="muted">${escapeHtml(r.direccion)}</div><div style="margin-top:8px"><a href="tel:${r.phone}" class="small">${escapeHtml(r.phone)}</a></div>`;
      wrapper.appendChild(d);
    });
    contenedor.appendChild(wrapper);
  }

  /* ----------------------------- Carrito ----------------------------- */
  function setupBotonesCarrito(){ renderElementosCarrito(); }

  function openCart(){
    const drawer = document.getElementById('carrito-drawer'); 
	drawer.classList.add('open'); 
	drawer.setAttribute('aria-hidden','false'); 
	document.getElementById('carrito_abierto').setAttribute('aria-expanded','true');
    renderElementosCarrito();
  }
  function cerrarCarrito(){
    const drawer = document.getElementById('carrito-drawer'); 
	drawer.classList.remove('open'); 
	drawer.setAttribute('aria-hidden','true'); 
	document.getElementById('carrito_abierto').setAttribute('aria-expanded','false');
  }

  function añadirACarrito(productId){
    const item = carrito.items.find(i=>i.productId===productId);
    if(item){ item.qty++;}
    else{carrito.items.push({productId, qty:1})};
    guardarCarrito(); renderContadorCarrito();
  }

  function removerDeCarrito(productId){ 
		carrito.items = carrito.items.filter(i=>i.productId!==productId);
		if(carrito.items.length===0) carrito.promoCodeApplied=null; 
		guardarCarrito(); 
		renderContadorCarrito(); 
		renderElementosCarrito(); 
  }
  
  function updateQty(productId, qty){ 
		qty = Math.max(0, Math.floor(qty)); if(qty===0) return removerDeCarrito(productId); 
		const it = carrito.items.find(i=>i.productId===productId); 
			if(it){ 
				it.qty = qty; 
				guardarCarrito(); 
				renderContadorCarrito(); 
				renderElementosCarrito(); 
			} 
		}

  function renderContadorCarrito(){ const contador = carrito.items.reduce((s,i)=>s+i.qty,0); document.getElementById('contador_carrito').textContent = contador; document.getElementById('carrito_vacio').textContent = contador===0? 'Vacío' : `${contador} producto(s)`; }

  function renderElementosCarrito(){
    const list = document.getElementById('productos_carrito'); list.innerHTML = '';
    if(carrito.items.length===0){ list.innerHTML='<div class="muted">No has añadido productos</div>'; updateTotals(); return; }

    carrito.items.forEach(it=>{
      const p = encontrarProducto(it.productId);
      const node = document.createElement('div'); node.className='carrito-elemento';
      node.innerHTML = `
        <div style="width:56px;height:48px;border-radius:8px;background:#fff;display:flex;align-items:center;justify-content:center">${svgThumb(p.name)}</div>
        <div style="flex:1">
          <div style="font-weight:700">${escapeHtml(p.name)}</div>
          <div class="muted small">€ ${p.precio.toFixed(2)}</div>
          <div class="qty" style="margin-top:8px;display:flex;gap:6px;align-items:center">
            <button class="btn" data-action="dec" aria-label="disminuir">−</button>
            <input type="number" min="1" value="${it.qty}" style="width:56px;padding:6px;border-radius:8px;border:1px solid rgba(0,0,0,0.08)" data-id="${it.productId}">
            <button class="btn" data-action="inc" aria-label="aumentar">+</button>
            <button class="btn" data-action="remove" aria-label="quitar">Quitar</button>
          </div>
        </div>
      `;
      // actions
      node.querySelector('[data-action="dec"]').addEventListener('click', ()=>{ updateQty(it.productId, it.qty-1); });
      node.querySelector('[data-action="inc"]').addEventListener('click', ()=>{ updateQty(it.productId, it.qty+1); });
      node.querySelector('[data-action="remove"]').addEventListener('click', ()=>{ removerDeCarrito(it.productId); });
      node.querySelector('input[type=number]').addEventListener('change', e=>{ const v = parseInt(e.target.value||0); updateQty(it.productId, v); });

      list.appendChild(node);
    });
    updateTotals();
  }

  function updateTotals(){
    const totals = calculateTotals();
    document.getElementById('carrito_subtotal').textContent = totals.subtotal.toFixed(2);
    document.getElementById('carrito-discontador').textContent = totals.discontador.toFixed(2);
    document.getElementById('carrito_total').textContent = totals.total.toFixed(2);
    document.getElementById('promo-feedback').textContent = carrito.promoCodeApplied? `Promoción aplicada: ${carrito.promoCodeApplied}` : '';
  }

  function calculateTotals(){
    let subtotal = 0;
    carrito.items.forEach(it=>{ const p = encontrarProducto(it.productId); subtotal += p.precio * it.qty; });
    let discontador = 0;
    if(carrito.promoCodeApplied && carrito.promoCodeApplied === promoSemanal.codigo){
      // aplicar 2x1 a un producto aleatorio dentro del carrito
      if(carrito.items.length>0){
        // Elige producto aleatorio entre los que haya en el carrito
        const idx = seededRandomIndex(carrito.items.length, promoSemanal.seedBase);
        const chosen = carrito.items[idx];
        const producto = encontrarProducto(chosen.productId);
        // calculamos pares
        const pairs = Math.floor(chosen.qty / 2);
        discontador = pairs * producto.precio;
      }
    }
    const total = Math.max(0, subtotal - discontador);
    return {subtotal, discontador, total};
  }

  function aplicarPromos(codigo){
    if(!codigo){ alert('Introduce un código'); return; }
    if(codigo === promoSemanal.codigo && promoValida(promoSemanal)){
      carrito.promoCodeApplied = codigo; 
	  guardarCarrito(); 
	  renderElementosCarrito(); 
	  updateTotals(); 
	  alert('Promoción aplicada. Se aplicará el 2x1 al producto aleatorio del carrito.');	  
    } else {
      alert('Código inválido o caducado');
    }
  }

  /* ----------------------------- Promoción semanal (espestañale por semana) ----------------------------- */
  function generarPromoSemanal(date){
    // ISO week + simple seed
    const iso = isoWeekYear(date);
    const seedBase = iso.week + '-' + iso.year;
    const short = b64random(seedBase).slice(0,4).toUpperCase();
    const codigo = `2X1-${iso.year}W${String(iso.week).padStart(2,'0')}-${short}`;
    const from = iso.monday;
    const to = iso.sunday;
    return {codigo, validFrom: formatDate(from), validTo: formatDate(to), seedBase};
  }

  function promoValida(promo){
    const today = new Date();
    const from = new Date(promo.validFrom);
    const to = new Date(promo.validTo);
    return today >= from && today <= to;
  }

  /* ----------------------------- Utilidades ----------------------------- */
  function cargarCarrito(){
    try{ const raw = localStorage.getItem(STORAGE_KEY); return raw? JSON.parse(raw) : {items:[], promoCodeApplied:null}; }catch(e){ return {items:[], promoCodeApplied:null}; }
  }
  function guardarCarrito(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito)); }

  function encontrarProducto(id){ return productos.find(p=>p.id===id) || {name:'Desconocido', precio:0}; }

  function agruparPor(arr, fn){ return arr.reduce((acc,x)=>{ const k = fn(x); (acc[k] = acc[k]||[]).push(x); return acc; }, {}); }

  function escapeHtml(str){ return String(str).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

  function svgThumb(label){
    // simple svg placeholder con texto
    const txt = label.length>10?label.slice(0,10)+'…':label;
    return `<svg width="92" height="72" viewBox="0 0 92 72" xmlns="http://www.w3.org/2000/svg"><rect width="92" height="72" rx="8" fill="#fff" stroke="#eee"/><text x="46" y="38" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="#333">${escapeHtml(txt)}</text></svg>`;
  }

  function animateAdd(el){ el.animate([{transform:'scale(1)'},{transform:'scale(0.98)'},{transform:'scale(1)'}],{duration:220}); }

  // small seeded pseudo-random index for deterministic behavior per week
  function seededRandomIndex(length, seed){ if(length<=0) return 0; const h = cyrb53(seed||String(Date.now())); return Math.abs(h) % length; }

  // Hash functions
  function b64random(s){ // base64-ish short
    const h = cyrb53(s); return btoa(String(h)).replace(/=+$/,'');
  }
  
  function cyrb53(str, seed = 0) {
    let h1 = 0xDEADBEEF ^ seed, h2 = 0x41C6CE57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  }

  // ISO week helpers: devuelve semana ISO y monday/sunday Date objects
  function isoWeekYear(date){
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    // Thursday in current week decides the year.
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
    // monday and sunday of that week
    const monday = new Date(d);
    monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay()||7)-1));
    const sunday = new Date(monday);
    sunday.setUTCDate(sunday.getUTCDate() + 6);
    // convert to local dates (midnight)
    const mLocal = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate());
    const sLocal = new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate(), 23,59,59);
    return {year: d.getUTCFullYear(), week: weekNo, monday: mLocal, sunday: sLocal};
  }

  function formatDate(d){ return d.toISOString().slice(0,10); }

 
 
