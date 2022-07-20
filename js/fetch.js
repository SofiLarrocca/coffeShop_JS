// Variables
let temperaturaValor = document.getElementById ('temperatura-valor')
let temperaturaDescripcion = document.getElementById ('temperatura-descripcion')

let ubicacion = document.getElementById ('ubicacion')
ubicacion.style.cursor = 'pointer'
let iconClima = document.getElementById ('icon')
   
let humedad = document.getElementById ('humedad')
let ciudad = 'Concordia' // Por defecto


function fetchWheater (ciudad) { 
//Obtener datos de API "OPEN WHEATER MAP" 

    if (navigator.geolocation) { 
        navigator.geolocation.getCurrentPosition (posicion => {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&units=metric&lang=es&appid=69c4c8621b59be229212f5ecee69fa96`
        
            // Peticiones a API
            fetch(url)
                .then(response => { return response.json()})
                .then(data => { 
                    // Render HTML Temperatura
                    let temp = Math.round(data.main.temp)
                    temperaturaValor.textContent = `${temp} °C`
                    
                    let desc = data.weather[0].description
                    temperaturaDescripcion.textContent = desc.toUpperCase() 

                    // Render HTML Ubiacion
                    ubicacion.textContent = data.name

                    // Render HTML Humedad 
                    humedad.textContent = `${data.main.humidity} %`

                    // Iconos Clima
                    switch (data.weather[0].main) { 
                        case 'Clouds':
                            iconClima.src = 'img/animated/cloudy.svg'
                            break;
                        
                        case 'Clear':
                            iconClima.src = 'img/animated/day.svg'
                            break;

                         case 'Rain':
                            iconClima.src = 'img/animated/rainy.svg'
                            console.log('LIMPIO')
                            break;
                    }

                })
                .catch(error => { 
                    console.log(error)
                })
        })
    }
}

fetchWheater (ciudad);

// Boton Cambiar ciudad:
    ubicacion.addEventListener ('click', () => { 
    let ciudad = prompt ('Ingrese su Ciudad')
    console.log (ciudad)
    fetchWheater (ciudad)
})