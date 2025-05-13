var catalogo = []
var carrito = JSON.parse(localStorage.getItem('carrito')) || []
var filtro = null
var page = 1


// Elementos del DOM
// Productos
const listProducts = document.querySelector("#products > ul")
const btnMore = document.querySelector("#btnMore")
const inputCategorias = document.querySelectorAll("[name='categoria']")

//Navbar
const navbar = document.querySelector("#navbar")
const btnMenu = document.querySelector("#btnMenu")
const btnCarrito = document.querySelector("#btnCarrito")

// Carrito
const cart = document.querySelector("#cart")
const listCart = document.querySelector("#cart > ul")
const btnRemoveAll = document.querySelector("#btnRemoveAll")
const subTotalCart = document.querySelector("#subtotal")
const shippingCart = document.querySelector("#envio")
const totalCart = document.querySelector("#total")


// Productos
const leerArchivo = async () => {
  return await (await fetch("/ntfs.json")).json()
}

// Mostrar los productos
const mostrarProductos = () => {
  let lista = []
  if (filtro == null) {
    // muestra los 3 primeros
    lista = catalogo.slice(0, page * 3)
  } else {
    lista = catalogo.filter((producto) => producto.category == filtro)
  }

  listProducts.innerHTML = ""
  lista.forEach((producto) => listProducts.append(tarjetaProducto(producto)))
}

// Muestra las tarjetas de los productos
const tarjetaProducto = (producto) => {
  const { id, name, bid, user, category, userImg, cardImg } = producto
  const elemento = document.createElement("li")
  const dataElemento = document.createElement("ul")

  const carritoItem = document.createElement("li")
  const carritoForm = document.createElement("form")
  const carritoButton = document.createElement("button")


  let templateImage = `<picture><img src="${cardImg}" alt=""></picture>`
  let templateData = `<li class="info"><h3>${name}</h3><p>Current Bid</p></li>`
  templateData += `<li class="user"><picture><img src="${userImg}" alt="user"></picture><dl class="user_data"><dt>user</dt>
                    <dd>@${user}</dd></dl><dl class="user_price"><dt>valor</dt><dd>${bid} eTH</dd></dl></li>`
  let templateCart = `<picture><img src="./assets/img/fire.png" alt="fire"></picture><p>05:12:07</p>`

  elemento.innerHTML = templateImage
  dataElemento.innerHTML = templateData

  carritoItem.classList.add("cart")
  carritoItem.innerHTML = templateCart
  carritoButton.innerText = "Add"

  carritoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Acá agregamos el producto al carrito (TODO)
    agregarProducto(id)
  });

  carritoForm.append(carritoButton)
  carritoItem.append(carritoForm)
  dataElemento.append(carritoItem)
  elemento.append(dataElemento)

  return elemento
}

// Filtra los productos por Categoria
const setearFiltros = (e) => {
  filtro = e.target.value

  let allLabels = document.querySelectorAll("label[for*='c-']")
  allLabels.forEach((label) => label.classList.remove("active"))
  let currentLabel = document.querySelector(`label[for='c-${filtro}']`)
  currentLabel.classList.add("active")

  if (filtro == "todas") {
    filtro = null
    page = 1
    btnMore.style.display = "flex"
  } else {
    btnMore.style.display = "none"
  }
  mostrarProductos()
}

// Mostrar mas tarjetas
const verMas = (e) => {
  e.preventDefault()
  page += 1
  if (page == 5) {
    page = 5
    btnMore.style.display = "none"
  }
  mostrarProductos()
}

catalogo = await leerArchivo()
mostrarProductos()

// Muestra mas tarjetas
btnMore.addEventListener("click", verMas)

// Filtrar
inputCategorias.forEach((input) => {
  input.addEventListener("change", setearFiltros)
})

// Actions Header
btnMenu.addEventListener("click", (e) => {
  e.preventDefault();
  cart.classList.remove("active");
  if (navbar.classList.contains("active")) {
    navbar.classList.remove("active");
  } else {
    navbar.classList.add("active");
  }
});

btnCarrito.addEventListener("click", (e) => {
  e.preventDefault();
  navbar.classList.remove("active");
  if (cart.classList.contains("active")) {
    cart.classList.remove("active");
  } else {
    cart.classList.add("active");
  }
})


// Carrito
const agregarProducto = (id) => {
  const producto = catalogo.find((p) => p.id == id)
  if (carrito.length == 0) {
    carrito.push({ ...producto, cantidad: 1 })
    localStorage.setItem("carrito", JSON.stringify(carrito))
    return mostrarCarrito()
  }

  let exist = carrito.find((item) => item.id == id)
  if (!exist) {
    carrito.push({ ...producto, cantidad: 1 })
    localStorage.setItem("carrito", JSON.stringify(carrito))
    return mostrarCarrito()
  }
  carrito = carrito.map((item) => {
    if (item.id == id) {
      item.cantidad += 1
    }
    return item
  })
  localStorage.setItem("carrito", JSON.stringify(carrito))
  return mostrarCarrito()
}

const quitarProducto = (id) => {
  carrito = carrito.filter((item) => item.id != id)
  localStorage.setItem("carrito", JSON.stringify(carrito))
  return mostrarCarrito()
}

const reducirCantidad = (id) => {
  carrito = carrito.map((item) => {
    if (item.id == id) {
      item.cantidad -= 1
    }
    return item
  })
  carrito = carrito.filter((item) => item.cantidad > 0)
  localStorage.setItem("carrito", JSON.stringify(carrito))
  return mostrarCarrito()
}

const vaciarCarrito = () => {
  carrito = []
  localStorage.removeItem("carrito")
  return mostrarCarrito()
}

const mostrarCarrito = () => {
  carrito = JSON.parse(localStorage.getItem('carrito')) || []
  listCart.innerHTML = null

  let subTotal = carrito.reduce((a, i) => (a += i.bid * i.cantidad), 0)
  subTotalCart.innerHTML = `${Number(subTotal).toFixed(2)} ETH`
  shippingCart.innerHTML = `${subTotal > 20 ? "Free" : `${Number(subTotal * 0.2).toFixed(2)}`}`
  totalCart.innerHTML = subTotal > 20 ? `${Number(subTotal).toFixed(2)} ETH` : `${Number(subTotal + (subTotal*0.2)).toFixed(2)} ETH`
  
  carrito.forEach((i) => listCart.append(item(i)))
}

const item = (item) => {
  const element = document.createElement("li")
  let template = `<picture><img src="${item.cardImg}" alt=""></picture>`
  template += `<dl><dd>${item.name}</dd><dd>Current bid</dd><dd>${Number(item.bid * item.cantidad).toFixed(2)} ETH</dd></dl>`

  const elementActions = document.createElement("fieldset")
  const btnReduce = document.createElement("button")
  const btnRemove = document.createElement("button")
  const outQuantity = document.createElement("output")
  const btnAdd = document.createElement("button")

  btnReduce.setAttribute("type", "button")
  btnRemove.setAttribute("type", "button")
  btnAdd.setAttribute("type", "button")

  outQuantity.innerHTML = item.cantidad
  btnReduce.innerText = "-"
  btnAdd.innerText = "+"
  btnRemove.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`


  btnReduce.addEventListener("click", (e) => {
    e.preventDefault()
    reducirCantidad(item.id)
  })

  btnAdd.addEventListener("click", (e) => {
    e.preventDefault()
    agregarProducto(item.id)
  })

  btnRemove.addEventListener("click", (e) => {
    e.preventDefault()
    quitarProducto(item.id)
  })

  element.innerHTML = template
  elementActions.append(item.cantidad > 1 ? btnReduce : btnRemove, outQuantity, btnAdd)
  element.append(elementActions)
  return element
}

mostrarCarrito()

btnRemoveAll.addEventListener("click", (e) => {
  e.preventDefault()
  let empty = confirm('Estas seguro de borrar todos los productos del carrito?')
  if (empty) {
    vaciarCarrito()
  }
})