/* ----------------------------- Datos iniciales ----------------------------- */
  const PRODUCTS = [
    {id:'p1',name:'Sushi Mix 12 piezas',category:'platos',price:12.5,desc:'Nigiri y maki surtidos',img:'imagenes/platos/12_mix.jpg'},
    {id:'p2',name:'Tempura Roll',category:'platos',price:9.0,desc:'Roll crujiente con tempura',img:'imagenes/platos/tempura_roll.jpg'},
    {id:'p3',name:'California Roll',category:'platos',price:8.5,desc:'Aguacate y cangrejo',img:'imagenes/platos/california_roll.png'},
    {id:'p4',name:'Poké Bowl',category:'platos',price:10.5,desc:'Arroz, atún marinado y toppings',img:'imagenes/platos/poke.jpg'},
	{id:'p5',name:'Maki 4 piezas',category:'platos',price:6.0,desc:'Arroz, aguacate y alga',img:'imagenes/platos/maki.jpg'},
	{id:'p6',name:'Nigiri 4 piezas',category:'platos',price:6.0,desc:'Arroz y pez mantuequilla',img:'imagenes/platos/nigiri.jpg'},
	{id:'p7',name:'Sashimi',category:'platos',price:11.0,desc:'atún, salmón y pulpo',img:'imagenes/platos/sashimi.jpg'},
	{id:'p8',name:'Tartar',category:'platos',price:10.5,desc:'Atun o Salmon',img:'imagenes/platos/tartar.jpg'},
    {id:'b1',name:'Agua 500ml',category:'bebidas',price:1.5,desc:'Agua mineral embotellada o de grifo',img:'imagenes/bebidas/agua.jpg'},
    {id:'b2',name:'Refresco 330ml',category:'bebidas',price:2.0,desc:'Lata refrigerada de ColaLoca, Llanta de Naranja, Noesté, Aguarrius y Sepsi',img:'imagenes/bebidas/refrescos.jpg'},
	{id:'b3',name:'Sake 500ml',category:'bebidas',price:8.5,desc:'Sake japones',img:'imagenes/bebidas/sake.jpg'},
	{id:'b4',name:'Estrella Galicia 300ml',category:'bebidas',price:3.0,desc:'Cerveza para la cabeza',img:'imagenes/bebidas/cerveza.jpg'},
	{id:'b5',name:'Té macha',category:'bebidas',price:3.5,desc:'Té tradicional',img:'imagenes/bebidas/té.jpg'},
    {id:'post1',name:'Mochi Matcha',category:'postres',price:3.5,desc:'Mochi relleno de helado',img:'imagenes/postres/mochi.jpg'},
    {id:'post2',name:'Dorayaki',category:'postres',price:2.8,desc:'Pastel japonés relleno',img:'imagenes/postres/dorayakis.jpg'},
	{id:'post3',name:'Mitarashi dango',category:'postres',price:5.0,desc:'Brocheta de bambú con diversas bolas de masa dulce',img:'imagenes/postres/dango.jpg'},
	{id:'post4',name:'Momiji Manjû',category:'postres',price:6.0,desc:'Pastelitos de huevos, azúcar, almíbar y azúcar granuladoonés relleno',img:'imagenes/postres/manju.jpg'},
	{id:'post5',name:'Taiyaki',category:'postres',price:4.5,desc:'dulce de harina de trigo relleno de frijoles rojos hervidos y mezclado con azúcar',img:'imagenes/postres/taiyaki.jpg'}
  ];

  const RESTAURANTS = [
    {name:'SushiGo Centro',address:'Calle Mayor, 12, 28013 Madrid',phone:'+34 91 123 45 67'},
    {name:'SushiGo Salamanca',address:'Calle de Serrano, 54, 28006 Madrid',phone:'+34 91 234 56 78'},
    {name:'SushiGo Vallecas',address:'Av. de la Albufera, 120, 28038 Madrid',phone:'+34 91 345 67 89'}
  ];

  /* ----------------------------- Estado y persistencia ----------------------------- */
  const STORAGE_KEY = 'sushigo_cart_v1';
  let cart = loadCart();
  let weeklyPromo = generateWeeklyPromo(new Date());

  /* ----------------------------- Inicialización ----------------------------- */
  document.addEventListener('DOMContentLoaded', ()=>{
    bindTabs();
    renderTab('menu');
    renderCartCount();
    setupCartButtons();
  });

  /* ----------------------------- Tabs ----------------------------- */
  function bindTabs(){
    document.querySelectorAll('.tab').forEach(btn=>{
      btn.addEventListener('click', e=>{
        document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        renderTab(tab);
      });
    });

    document.getElementById('open-cart').addEventListener('click', openCart);
    document.getElementById('close-cart').addEventListener('click', closeCart);
    document.getElementById('apply-promo').addEventListener('click', ()=>{
      const code = document.getElementById('promo-input').value.trim();
      applyPromo(code);
    });
    document.getElementById('checkout').addEventListener('click', ()=>{
      if(cart.items.length === 0) return alert('El carrito está vacío');
      // demo: finalizar compra
	  renderCheckoutForm();
	  closeCart();
    });

    // close with ESC
    document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeCart(); });
  }

  
  function renderTab(tab){
    const main = document.getElementById('main-content');
    main.innerHTML = '';
    if(tab==='menu') renderMenu(main);
    else if(tab==='promos') renderPromos(main);
    else if(tab==='restaurants') renderRestaurants(main);
  }
  
  /*...............................Render: Compra-----------------------------*/
  
  function renderCheckoutForm(){
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <h2>Finalizar compra</h2>
      <form id="delivery-form" class="checkout-form">
        <label><input type="radio" name="delivery" value="domicilio" checked> Envío a domicilio</label>
        <div id="address-input">
          <input type="text" id="shipping-address" placeholder="Introduce tu dirección">
        </div>
        <label><input type="radio" name="delivery" value="recogida"> Recogida en restaurante</label>
        <div id="restaurant-select" style="display:none">
          <select id="pickup-restaurant">
            ${RESTAURANTS.map((r,i)=>`<option value="${r.address}">${r.name} - ${r.address}</option>`).join('')}
          </select>
        </div>
        <button type="submit" class="btn add" style="margin-top:12px">Confirmar pedido</button>
      </form>
    `;

    // alternar campos según opción
    main.querySelectorAll('input[name="delivery"]').forEach(r=>{
      r.addEventListener('change', ()=>{
        document.getElementById('address-input').style.display = r.value==="domicilio"?"block":"none";
        document.getElementById('restaurant-select').style.display = r.value==="recogida"?"block":"none";
      });
    });

    main.querySelector('#delivery-form').addEventListener('submit', e=>{
      e.preventDefault();
      const mode = main.querySelector('input[name="delivery"]:checked').value;
      let address = mode==="domicilio" ? document.getElementById('shipping-address').value.trim()
                                       : document.getElementById('pickup-restaurant').value;
      if(!address) return alert("Introduce una dirección o selecciona un restaurante");
      renderOrderTracking(address, mode);
      cart = {items:[], promoCodeApplied:null};
      saveCart(); renderCartCount();
    });
  }
  
  /*------------------------------Render:seguimiento--------------------------*/
  function renderOrderTracking(address, mode){
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <h2>Seguimiento de pedido</h2>
      <p>${mode==="domicilio" ? "Enviado a domicilio:" : "Recogida en:"} <strong>${escapeHtml(address)}</strong></p>
      <div class="map-container">
        <iframe
          width="100%" height="300" style="border:0" loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed"></iframe>
      </div>
      <div class="order-status">
        <div id="status-text">Preparando pedido...</div>
        <div class="status-bar"><div id="status-progress"></div></div>
      </div>
    `;

    const steps = ["Preparando pedido","Listo para recoger","En reparto","Entregado"];
    let idx = 0;
    const progress = document.getElementById("status-progress");
    const text = document.getElementById("status-text");

    function update(){
      text.textContent = steps[idx];
      progress.style.width = ((idx+1)/steps.length*100)+"%";
      idx++;
      if(idx<steps.length){ setTimeout(update,60000); } // avanza cada minuto
    }
    update();
  }


  /* ----------------------------- Render: Menú ----------------------------- */
  function renderMenu() {
    const main = document.getElementById("main-content");
    main.innerHTML = `
      <div class="categories">
        <div class="category-select" data-cat="platos">
          <img src="imagenes/platos.jpg" alt="Platos">
          <h2>Platos</h2>
        </div>
        <div class="category-select" data-cat="bebidas">
          <img src="imagenes/bebidas.jpg" alt="Bebidas">
          <h2>Bebidas</h2>
        </div>
        <div class="category-select" data-cat="postres">
          <img src="imagenes/postres.jpg" alt="Postres">
          <h2>Postres</h2>
        </div>
      </div>
    `; 
    document.querySelectorAll(".category-select").forEach(div=>{
      div.addEventListener("click",()=>{
        const cat = div.dataset.cat;
        renderCategory(cat);
      });
    });
  }

  function renderCategory(cat){
    const main = document.getElementById("main-content");
    main.innerHTML = `<h2>${cat.toUpperCase()}</h2><div id="products"></div>`;
    const productsEl = document.getElementById("products");
    const items = PRODUCTS.filter(p=>p.category===cat);
    items.forEach(p=>{
      const card = document.createElement("div");
      card.className="product-card";
      card.innerHTML = `
        <div class="product-thumb">
			<img src="${p.img}" alt"${p.name}">
		</div>
		
        <div class="product-info">
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <div class="product-meta">
            <div class="price">€ ${p.price.toFixed(2)}</div>
            <button class="btn add" data-id="${p.id}">Añadir</button>
          </div>
        </div>`;
      card.querySelector("button").addEventListener("click",()=>addToCart(p.id));
      productsEl.appendChild(card);
    });
  }


  /* ----------------------------- Render: Promociones ----------------------------- */
  function renderPromos(container){
    const promo = weeklyPromo;
    const el = document.createElement('div'); el.className='promo-card';
    el.innerHTML = `
      <h2>Promoción semanal</h2>
      <p class="muted">Cada semana generamos un código 2x1 válido para un producto aleatorio del carrito. El código cambia los lunes.</p>
      <div style="margin-top:12px">
        <div class="promo-code" id="promo-code">${promo.code}</div>
        <div class="muted small" style="margin-top:8px">Válido desde: ${promo.validFrom} hasta ${promo.validTo}</div>
      </div>
      <div style="margin-top:12px">
        <button class="btn" id="copy-promo">Copiar código</button>
      </div>
	  
	  <div style="margin-top:12px">
	          <img src="imagenes/feliz.png" alt="familia feliz" style="margin-left: 110px; width: 800px; height: 296px;">
	  </div>
	  
	  
    `;
    container.appendChild(el);
    el.querySelector('#copy-promo').addEventListener('click', ()=>{
      navigator.clipboard?.writeText(promo.code).then(()=>alert('Código copiado'));
    });
  }

  /* ----------------------------- Render: Restaurantes ----------------------------- */
  function renderRestaurants(container){
    const wrapper = document.createElement('div'); wrapper.className='restaurants';
    RESTAURANTS.forEach(r=>{
      const d = document.createElement('div'); d.className='restaurant';
      d.innerHTML = `<h3>${escapeHtml(r.name)}</h3><div class="muted">${escapeHtml(r.address)}</div><div style="margin-top:8px"><a href="tel:${r.phone}" class="small">${escapeHtml(r.phone)}</a></div>`;
      wrapper.appendChild(d);
    });
    container.appendChild(wrapper);
  }

  /* ----------------------------- Carrito ----------------------------- */
  function setupCartButtons(){ renderCartItems(); }

  function openCart(){
    const drawer = document.getElementById('cart-drawer'); drawer.classList.add('open'); drawer.setAttribute('aria-hidden','false'); document.getElementById('open-cart').setAttribute('aria-expanded','true');
    renderCartItems();
  }
  function closeCart(){
    const drawer = document.getElementById('cart-drawer'); drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); document.getElementById('open-cart').setAttribute('aria-expanded','false');
  }

  function addToCart(productId){
    const item = cart.items.find(i=>i.productId===productId);
    if(item) item.qty++;
    else cart.items.push({productId, qty:1});
    saveCart(); renderCartCount();
  }

  function removeFromCart(productId){ cart.items = cart.items.filter(i=>i.productId!==productId); if(cart.items.length===0) cart.promoCodeApplied=null; saveCart(); renderCartCount(); renderCartItems(); }
  function updateQty(productId, qty){ qty = Math.max(0, Math.floor(qty)); if(qty===0) return removeFromCart(productId); const it = cart.items.find(i=>i.productId===productId); if(it){ it.qty = qty; saveCart(); renderCartCount(); renderCartItems(); } }

  function renderCartCount(){ const count = cart.items.reduce((s,i)=>s+i.qty,0); document.getElementById('cart-count').textContent = count; document.getElementById('cart-empty-hint').textContent = count===0? 'Vacío' : `${count} producto(s)`; }

  function renderCartItems(){
    const list = document.getElementById('cart-items'); list.innerHTML = '';
    if(cart.items.length===0){ list.innerHTML='<div class="muted">No has añadido productos</div>'; updateTotals(); return; }

    cart.items.forEach(it=>{
      const p = findProduct(it.productId);
      const node = document.createElement('div'); node.className='cart-item';
      node.innerHTML = `
        <div style="width:56px;height:48px;border-radius:8px;background:#fff;display:flex;align-items:center;justify-content:center">${svgThumb(p.name)}</div>
        <div style="flex:1">
          <div style="font-weight:700">${escapeHtml(p.name)}</div>
          <div class="muted small">€ ${p.price.toFixed(2)}</div>
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
      node.querySelector('[data-action="remove"]').addEventListener('click', ()=>{ removeFromCart(it.productId); });
      node.querySelector('input[type=number]').addEventListener('change', e=>{ const v = parseInt(e.target.value||0); updateQty(it.productId, v); });

      list.appendChild(node);
    });
    updateTotals();
  }

  function updateTotals(){
    const totals = calculateTotals();
    document.getElementById('cart-subtotal').textContent = totals.subtotal.toFixed(2);
    document.getElementById('cart-discount').textContent = totals.discount.toFixed(2);
    document.getElementById('cart-total').textContent = totals.total.toFixed(2);
    document.getElementById('promo-feedback').textContent = cart.promoCodeApplied? `Promoción aplicada: ${cart.promoCodeApplied}` : '';
  }

  function calculateTotals(){
    let subtotal = 0;
    cart.items.forEach(it=>{ const p = findProduct(it.productId); subtotal += p.price * it.qty; });
    let discount = 0;
    if(cart.promoCodeApplied && cart.promoCodeApplied === weeklyPromo.code){
      // aplicar 2x1 a un producto aleatorio dentro del carrito
      if(cart.items.length>0){
        // Elige producto aleatorio entre los que haya en el carrito
        const idx = seededRandomIndex(cart.items.length, weeklyPromo.seedBase);
        const chosen = cart.items[idx];
        const product = findProduct(chosen.productId);
        // calculamos pares
        const pairs = Math.floor(chosen.qty / 2);
        discount = pairs * product.price;
      }
    }
    const total = Math.max(0, subtotal - discount);
    return {subtotal, discount, total};
  }

  function applyPromo(code){
    if(!code){ alert('Introduce un código'); return; }
    if(code === weeklyPromo.code && isPromoValid(weeklyPromo)){
      cart.promoCodeApplied = code; saveCart(); renderCartItems(); updateTotals(); alert('Promoción aplicada. Se aplicará el 2x1 al producto aleatorio del carrito.');
    } else {
      alert('Código inválido o caducado');
    }
  }

  /* ----------------------------- Promoción semanal (estable por semana) ----------------------------- */
  function generateWeeklyPromo(date){
    // ISO week + simple seed
    const iso = isoWeekYear(date);
    const seedBase = iso.week + '-' + iso.year;
    const short = b64random(seedBase).slice(0,4).toUpperCase();
    const code = `2X1-${iso.year}W${String(iso.week).padStart(2,'0')}-${short}`;
    const from = iso.monday;
    const to = iso.sunday;
    return {code, validFrom: formatDate(from), validTo: formatDate(to), seedBase};
  }

  function isPromoValid(promo){
    const today = new Date();
    const from = new Date(promo.validFrom);
    const to = new Date(promo.validTo);
    return today >= from && today <= to;
  }

  /* ----------------------------- Utilidades ----------------------------- */
  function loadCart(){
    try{ const raw = localStorage.getItem(STORAGE_KEY); return raw? JSON.parse(raw) : {items:[], promoCodeApplied:null}; }catch(e){ return {items:[], promoCodeApplied:null}; }
  }
  function saveCart(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); }

  function findProduct(id){ return PRODUCTS.find(p=>p.id===id) || {name:'Desconocido', price:0}; }

  function groupBy(arr, fn){ return arr.reduce((acc,x)=>{ const k = fn(x); (acc[k] = acc[k]||[]).push(x); return acc; }, {}); }

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

  /* ----------------------------- Pequeña semilla para elegir aleatorio estable ----------------------------- */
  // seededRandomIndex uses cyrb53 on the seedBase and cart content; but we keep it simple above
