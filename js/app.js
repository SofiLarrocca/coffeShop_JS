// HTML BODY

let contenedorProductos = document.getElementById('contenedor_productos-productos')

mostrarProductosHTML(productos) 
// Mostrar productos en HTML
function mostrarProductosHTML (listaProducto) { 
      listaProducto.forEach ((producto) => { 
        // Creamos la card para cada producto
        let card = document.createElement ('div')
        card.className = 'card'
        // Completamos la card con descripcion del producto
        let img = document.createElement ('img')
        img.src = producto.img
        img.className = 'img-card'
        let marcaCard = document.createElement ('h3')
        marcaCard.innerText = producto.marca
        let variedadCard = document.createElement ('h4')
        variedadCard.innerText = producto.variedad
        let precioCard = document.createElement ('h3')
        precioCard.innerText = '$ ' + (producto.precio)

        btnCard = document.createElement('button')
        btnCard.innerText = 'Comprar'
        btnCard.className = 'btn--black'

        contenedorProductos.append(card)
        card.append(img, marcaCard, variedadCard, precioCard, btnCard)


        // Evento click "añadir al carrito"
        btnCard.addEventListener('click', ()=> { 
            contenedorCarrito.innerHTML = '' 
            agregarCarrito(producto)
    })
})}

// MÉTODOS DE BUSQUEDA:

// BUSCAR DE PRODUCTOS
let buscador = document.getElementById ('input-buscar')

buscador.addEventListener ('keyup', ()=> { 
    buscarProducto()

    // Al buscar en el "buscador" el filtro vuelve a "todas las marcas"
    filtroMarca.value = 'todos'
})

function buscarProducto () { 
    // Capto el valor ingresado en el buscador 
    let productoBuscado = buscador.value.toLowerCase()

    // Muestro en HTML aquellos productos que coincidan con el texto ingresado en buscador
    let productoFiltrado = productos.filter((prod) => prod.marca.toLowerCase().includes(productoBuscado) || prod.variedad.toLowerCase().includes(productoBuscado) || prod.tipo.toLowerCase().includes(productoBuscado))
    
    // Si el buscador está vacío: aparecen TODOS los productos
    if (productoBuscado == '') { 
        contenedorProductos.innerHTML = ''
        mostrarProductosHTML(productos)
        // Si se encontró producto buscado:
    } else if(productoFiltrado.length !=0 && productoBuscado!= '') { 
        contenedorProductos.innerHTML = ''
        mostrarProductosHTML(productoFiltrado)
        // Si el producto no existe aparece texto: "Producto no encontrado"
    } else {
        contenedorProductos.innerHTML = ''
        let texto = document.createElement ('p')
        texto.innerText = 'Producto no encontrado'
        contenedorProductos.append(texto)
    }
}

// FILTRAR PRODUCTOS
/* Por marca:*/
let filtroMarca = document.getElementById ('filtro-marca')
   
filtroMarca.addEventListener ('click', ()=> { 
    filtrarMarca()
    // Una vez que se selecciona una marca lo que esté escrito en el buscador se borra
    buscador.value = ''
})

function filtrarMarca () {
    // Busco en el array productos aquellos productos que su atributo "filtro" coincida con el selccionado
    let marcaFiltrada = productos.filter((productos => productos.filtro === filtroMarca.value))

    // Si el filtro es "todos" se mostraran TODOS los productos del array "productos"
    if (filtroMarca.value === 'todos') { 
        mostrarProductosHTML(productos)
        // Si se seleccionó una marca, aparecerán todos aquellos productos que concidan con la marca seleccionada
    } else if (marcaFiltrada.length != 0) { 
        contenedorProductos.innerHTML = ''
        mostrarProductosHTML (marcaFiltrada)
    } 
}

/* Por precio:*/
let filtroPrecio = document.getElementById ('order-precio')

filtroPrecio.addEventListener ('click', ()=> { 
    ordenarPrecio()
})

function ordenarPrecio () { 
    if (filtroPrecio.value === 'menor_precio') { 
        let menorPrecio = productos.sort((a,b) =>  a.precio - b.precio)
            contenedorProductos.innerHTML = ''
            mostrarProductosHTML (menorPrecio)
    } else if (filtroPrecio.value === 'mayor_precio') { 
        let mayorPrecio = productos.sort((a,b) => {
            return b.precio - a.precio })
            contenedorProductos.innerHTML = ''
        mostrarProductosHTML (mayorPrecio)
    } 
}


// CARRITO COMPRAS

//Variables carrito
let contadorCarrito = document.getElementById('contador-cart')
let cartIcon = document.getElementById ('bi-cart')
let contenedorCarrito = document.getElementById ('container-cart') /*donde se van a cargar los productos seleccionados*/

let carrito = []

document.addEventListener ('DOMContentLoaded', ()=> { 
    if (localStorage.getItem('carrito')) { 
        carrito = JSON.parse(localStorage.getItem('carrito'))
        actualizarCarrito()
    }
})

// Evento click en Icono Carrito cuando el carrito aún está vacío
cartIcon.addEventListener ('click', () => { 
    contenedorCarrito.classList.toggle ('block')
    if(carrito.length == 0) { 
     // Si el carrito esta vacío aparece el siguiente mensaje:
     contenedorCarrito.innerHTML = ''
     const div = document.createElement('div')
     div.style.display = 'flex'
     div.style.alignItems = 'center'
     div.innerHTML = `
     <p>El carrito está vacío</p>
     <a href=#productos class='btn-cart'>Comprar</a>` 
     contenedorCarrito.append(div)
    } else { 
     /*Si el carrito tiene productos, podrás finalizar la compra*/
     finalizarCompra () }
 })


// Manipular Carrito de Compras
function agregarCarrito (producto) {
    // Agregar producto al carrito:
    // Primero verificar si el producto está agregado o no. Si no está: lo agrega, si ya fue agregado: le suma a la cantidad
    
    // Busco el producto seleccionada en el array "Productos" por el id
    let productoSeleccionado = productos.find (idProd => idProd.id === producto.id)

    // Busco si el id del producto que seleccioné ya está en el carrito
    let prodDuplicado = carrito.find((idProd) => idProd.id === productoSeleccionado.id)
    
    // Si el producto NO está en el carrito: lo agrega
    if (!prodDuplicado) { 
        carrito.push({...productoSeleccionado, cantidad: 1})
        // let suma = carrito.reduce((acc , prod)=> acc + prod.cantidad , 0)
        // contadorCarrito.innerHTML = `<p> ${suma}</p>`
    } else { 
        /* Si no, suma +1 a la cantidad */
        let carritoFiltrado = carrito.filter(prod => prod.id != prodDuplicado.id)        
        carrito = [...carritoFiltrado, {...prodDuplicado, cantidad: prodDuplicado.cantidad + 1}]
    }

    // LIBRERA TOASTY
    Toastify({
        text: "Se agregó producto al carrito",
        duration: 1000,
        gravity: 'bottom',
        position: 'right',
        className: 'notificacion my-toast'
    }).showToast();


    actualizarCarrito()
    precioTotal ()
}

// Eliminar producto del carrito
function eliminarProducto (prodCarrito) { 
// Busco el incide dentro del array carrito del producto a eliminar
    const item = carrito.find (e=> e.id === prodCarrito.id)
    const indice = carrito.indexOf(item)
    carrito.splice(indice, 1)
    

    actualizarCarrito ()
    precioTotal ()
    finalizarCompra()
}

// Calcular precio total de la compra
function precioTotal () {
    const precioTotal = document.createElement('div')
    precioTotal.innerHTML = `
    <p>PRECIO TOTAL $ ${carrito.reduce((acc , precioProd)=> acc + precioProd.precio*precioProd.cantidad ,0)}</p>`
    // Estilos texto precio total
    precioTotal.style.fontWeight = 800
    precioTotal.style.marginTop = '2rem'
    precioTotal.style.textAlign = 'right'

    contenedorCarrito.append(precioTotal)
}

// Mostrar productos seleccionados en el carrito:
function actualizarCarrito () {
    carrito.forEach ((prodCarrito) => {
        const div = document.createElement('div')
        div.className = 'div-cart'

        // Creamos elementos a dibujar en div
        div.innerHTML = `
        <img class='img-cart' src=${prodCarrito.img}>
        <h3>${prodCarrito.marca}</h3>
        <h4>${prodCarrito.variedad}</h4>
        <p>$ ${prodCarrito.precio}</p>`
        contenedorCarrito.append(div)
        
        let botonEliminar = document.createElement ('i')
        botonEliminar.className= "bi bi-trash"
        botonEliminar.style.padding = '0 1rem'
        botonEliminar.style.fontSize = '1.5rem'
        let cantidad = document.createElement ('p')
        cantidad.innerText = `${prodCarrito.cantidad}`
        
        contenedorCarrito.append(div)
        div.append(botonEliminar)

        contenedorCarrito.append(div)
        div.append(cantidad)

        // Evento botón eliminar producto del carrito
        botonEliminar.addEventListener ('click', () => { 
            contenedorCarrito.innerHTML = ''            
            eliminarProducto(prodCarrito)

        //OPERADOR AND
        carrito.length == 0 && (contenedorCarrito.style.display = 'none') 

        localStorage.setItem('carrito', JSON.stringify(carrito)) 
        contadorCarrito.innerText = carrito.reduce ((acc, prod)=> acc + prod.cantidad, 0)
    })

    localStorage.setItem('carrito', JSON.stringify(carrito)) 
    contadorCarrito.innerText = carrito.reduce ((acc, prod)=> acc + prod.cantidad, 0)
    finalizarCompra()
})}



//FORMULARIO COMPRA
let btnFinalizar = document.getElementById ('btnFinalizar')
let formulario = document.getElementById('formulario')  
let cartFormulario = document.getElementById('cart-formulario')
let cerrarFormulario = document.getElementById('cerrar_formulario')

function finalizarCompra () {
    // Una vez que se agregó productos al carrito aparece el Botón 'FINALIZAR COMPRA'
    //OPERADOR TERNARIO
    carrito.length !=0 ? (btnFinalizar.style.display ='block') : (btnFinalizar.style.display = 'none')
}

cerrarFormulario.addEventListener ('click', ()=> { 
    formulario.classList.toggle ('block')
})


btnFinalizar.addEventListener ("click", ()=> { 
    cartFormulario.innerHTML = ''
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            cancelButton: 'btn btn-danger',
            confirmButton: 'btn btn-success'
        },
        buttonsStyling: false
      })
    //   LIBRERIA SWEET ALERT
      swalWithBootstrapButtons.fire({
        title: '¿Estás seguro de finalizar la compra?',
        showCancelButton: true,
        cancelButtonText: 'No',
        confirmButtonText:  'Si',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
        //Una vez que el usuario finalizó y confirmó la compra, aparecerá formulario 
        formulario.classList.toggle ('block')
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Su compra ha sido cancelada',
          )
        }
      })


    // Buscamos info sobre productos comprados en LocalStorage
    let compra = JSON.parse (localStorage.getItem('carrito'))  
    
    let parrafo = document.createElement ('p')
    parrafo.innerText = 'TU CARRITO'
    
    cartFormulario.append(parrafo)
    
    // Muestra en formulario el carrito comprado
    compra.forEach ((e) => { 
        const detalleCart = document.createElement('div')

        detalleCart.innerHTML = `
        <p>${e.cantidad}</p>
        <img class='img-cart' src=${e.img}>
        <h3>${e.marca}</h3>
        <h4>${e.variedad}</h4>
        <p class='text-right'><span>${e.precio}</span></p>`

        cartFormulario.append(detalleCart)

        //Estilos detalleCart
        detalleCart.style.display = 'flex'
        detalleCart.style.alignItems = 'center'
        detalleCart.className = 'cart-formulario'
    })
})


// Boton ENVIAR
let enviar = document.getElementById ('enviar')

enviar.addEventListener ('click', () => { 
    let comprador = document.getElementById ('nombre').value
    let emailComprador = document.getElementById ('email').value
    let telComprador = document.getElementById ('telefono').value

    if (comprador.length !== 0 && emailComprador.length !== 0 && telComprador !== 0) { 
        Toastify({
            text: `Gracias ${comprador} por la compra \n
            Se enviará un correo para proceder al pago`,
            duration: 4000,
            gravity: 'top',
            position: 'right',
            style: {
                background: "linear-gradient(to right, #0dec6a, #40a826)",
                textAlign: 'center',
              },
        }).showToast();
    } else {
        Toastify({
            text: `Debes completar el formulario con datos correctos`,
            duration: 3000,
            gravity: 'top',
            position: 'center',
            style: {
                background: "linear-gradient(to right, #f12315, #ee8142)",
              },
        }).showToast();
    }

    guardarCompra()
    localStorage.removeItem ('carrito')
})


//Guardamos la compra en LocalStorage
function guardarCompra () { 
    let nombreComprador = document.getElementById ('nombre').value
    let emailComprador = document.getElementById ('email').value
    let telComprador = document.getElementById ('telefono').value
    let carritoUsuario = JSON.parse(localStorage.getItem('carrito'))
    
    let nombre = localStorage.setItem('nombreComprador', JSON.stringify(nombreComprador))
    let email = localStorage.setItem('emailComprador', JSON.stringify(emailComprador))
    let telefono = localStorage.setItem ('telComprador', JSON.stringify(telComprador))
    let compra = localStorage.setItem ('compra', JSON.stringify(carritoUsuario))    
}

// Creamos nuevo objeto por cada pedido enviado
class Pedido { 
    constructor(idComprador, nombre, email, telefono, pedido) { 
        this.idComprador = idComprador,
        this.nombre = nombre,
        this.email = email,
        this.telefono = telefono,
        this.pedido = [pedido] 
    }
}

//Capturamos info guardada de la compra y la mostramos por consola
function pedidoEnviado () {
    let nombre = JSON.parse(localStorage.getItem('nombreComprador'))
    let email =  JSON.parse(localStorage.getItem('emailComprador'))
    let telefono = JSON.parse(localStorage.getItem('telComprador'))
    let compra = JSON.parse(localStorage.getItem('compra'))   
    
    
    pedido1 = new Pedido (1, nombre, email, telefono, compra)
    console.log (pedido1)
}

pedidoEnviado()







