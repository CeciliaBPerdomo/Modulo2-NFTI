var catalogo = []
var carrito = JSON.parse(localStorage.getItem('carrito')) || []
var filtro = null
var page = 1


// Elementos del DOM
const listProducts = document.querySelector("#products > ul")
const btnMore = document.querySelector("#btnMore")
const cart = document.querySelector("#cart")
const listCart = document.querySelector("#cart > ul")
const navbar = document.querySelector("#navbar")
const btnMenu = document.querySelector("#btnMenu")
const btnCarrito = document.querySelector("#btnCarrito")
const inputCategorias = document.querySelectorAll("[name='categoria']")

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
