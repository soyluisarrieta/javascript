import sizes from './getSizes.js'

// Observar evento cuando cambia el fullscreen
document.addEventListener('fullscreenchange', function () {
  if (document.fullscreenElement) {
    console.log('En pantalla completa', sizes())
  } else {
    console.log('No está en pantalla completa', sizes())
  }
})

// Activar fullscreen cuando presiona clic
document.addEventListener('click', function () {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.log(`Error al intentar entrar en modo de pantalla completa: ${err.message} (${err.name})`)
    })
  } else {
    /* Salir de pantalla completa
    document.exitFullscreen().catch(err => {
        console.log(`Error al intentar salir del modo de pantalla completa: ${err.message} (${err.name})`)
    })
    */
  }
})
