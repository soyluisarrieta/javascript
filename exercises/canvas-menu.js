// Inicializaciones
const CANVAS = document.getElementById('canvas')
const CTX = CANVAS.getContext('2d')

// Configuraciones
CANVAS.width = window.screen.width - 2
CANVAS.height = window.screen.height - 2

// Inicio del canvas
function init () {
  CTX.fillStyle = 'red'
  CTX.fillRect(0, 0, CANVAS.width, CANVAS.height)
}

// Ejecución inicial
document.addEventListener('DOMContentLoaded', () => {
  init()
})
