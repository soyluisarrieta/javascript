// Variables globales
const CANVAS = document.getElementById('gameCanvas')
const CTX = CANVAS.getContext('2d')
const GLOBAL_ZONES = new Array(3).fill(null)
const COLORS = ['#FF0000', '#00FF00', '#5798c4', '#FFFF00', '#FF00FF']
const BOXES = []
const ZONES = []
const BOX_SIZE = 90
const ZONE_SIZE = 100

let draggedBox = null
let offsetX, offsetY
let originalZone = null

// Clase para las cajas
class Box {
  constructor (x, y, color) {
    this.x = x
    this.y = y
    this.color = color
    this.startX = x
    this.startY = y
  }

  // Dibujar la caja
  draw () {
    if (this === draggedBox) {
      CTX.shadowColor = 'rgba(0, 0, 0, 0.5)'
      CTX.shadowBlur = 10
      CTX.shadowOffsetX = 5
      CTX.shadowOffsetY = 5
    } else {
      CTX.shadowColor = 'transparent'
    }
    CTX.fillStyle = this.color
    CTX.fillRect(this.x, this.y, BOX_SIZE, BOX_SIZE)
    CTX.shadowColor = 'transparent'
  }

  // Verificar si el ratón está sobre la caja
  isUnderMouse (mx, my) {
    return mx >= this.x && mx <= this.x + BOX_SIZE && my >= this.y && my <= this.y + BOX_SIZE
  }

  // Mover la caja a una nueva posición con animación
  moveTo (x, y, duration, callback) {
    const startX = this.x
    const startY = this.y
    const deltaX = x - startX
    const deltaY = y - startY
    const startTime = performance.now()

    const animate = () => {
      const currentTime = performance.now()
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeInOut = progress * (2 - progress)

      this.x = startX + deltaX * easeInOut
      this.y = startY + deltaY * easeInOut

      if (progress < 1) {
        window.requestAnimationFrame(animate)
      } else {
        if (callback) callback()
      }

      draw()
    }

    window.requestAnimationFrame(animate)
  }

  // Restablecer la posición original de la caja
  resetPosition () {
    this.moveTo(this.startX, this.startY, 300)
  }
}

// Clase para las zonas de colocación
class Zone {
  constructor (x, y) {
    this.x = x
    this.y = y
    this.box = null
  }

  // Dibujar la zona
  draw () {
    CTX.strokeStyle = 'rgb(255 255 255 / 70%)'
    CTX.setLineDash([5, 3])
    CTX.strokeRect(this.x, this.y, ZONE_SIZE, ZONE_SIZE)
    CTX.setLineDash([])
  }

  // Verificar si el ratón está dentro de la zona
  isInside (mx, my) {
    return mx >= this.x && mx <= this.x + ZONE_SIZE && my >= this.y && my <= this.y + ZONE_SIZE
  }

  // Colocar una caja en la zona
  placeBox (box) {
    if (this.box) {
      const previousBox = this.box
      this.box = box
      box.moveTo(this.x + (ZONE_SIZE - BOX_SIZE) / 2, this.y + (ZONE_SIZE - BOX_SIZE) / 2, 200, () => {
        previousBox.resetPosition()
      })
    } else {
      this.box = box
      box.moveTo(this.x + (ZONE_SIZE - BOX_SIZE) / 2, this.y + (ZONE_SIZE - BOX_SIZE) / 2, 200)
    }
  }

  // Intercambiar una caja con la zona
  exchangeBox (box) {
    const tempBox = this.box
    this.box = box
    box.moveTo(this.x + (ZONE_SIZE - BOX_SIZE) / 2, this.y + (ZONE_SIZE - BOX_SIZE) / 2, 200)
    return tempBox
  }

  // Quitar la caja de la zona
  removeBox () {
    this.box = null
  }
}

// Inicializar el canvas y crear cajas y zonas
function init () {
  // Crear cajas
  for (let i = 0; i < 5; i++) {
    const posX = (CANVAS.width / (COLORS.length + 1)) * (i + 1) - (BOX_SIZE / 2)
    const box = new Box(posX, 50, COLORS[i])
    BOXES.push(box)
  }

  // Crear zonas
  for (let i = 0; i < GLOBAL_ZONES.length; i++) {
    const posX = (CANVAS.width / (GLOBAL_ZONES.length + 1)) * (i + 1) - (ZONE_SIZE / 2)
    const zone = new Zone(posX, 470)
    ZONES.push(zone)
  }

  draw()
}

// Dibujar el canvas
function draw () {
  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height)
  ZONES.forEach(zone => zone.draw())
  BOXES.forEach(box => box.draw())
}

// Evento de arrastrar el ratón (mousedown)
CANVAS.addEventListener('mousedown', (e) => {
  const mouseX = e.offsetX
  const mouseY = e.offsetY
  draggedBox = BOXES.find(box => box.isUnderMouse(mouseX, mouseY))
  if (draggedBox) {
    offsetX = mouseX - draggedBox.x
    offsetY = mouseY - draggedBox.y
    originalZone = ZONES.find(zone => zone.box === draggedBox)
    if (originalZone) {
      originalZone.removeBox()
    }
    // Mover la caja arrastrada al final del array BOXES
    BOXES.push(BOXES.splice(BOXES.indexOf(draggedBox), 1)[0])
    CANVAS.style.cursor = 'grabbing'
  }
})

// Evento de movimiento del ratón (mousemove)
CANVAS.addEventListener('mousemove', (e) => {
  if (draggedBox) {
    draggedBox.x = e.offsetX - offsetX
    draggedBox.y = e.offsetY - offsetY
    draw()
    CANVAS.style.cursor = 'grabbing'
  } else {
    const mouseX = e.offsetX
    const mouseY = e.offsetY
    if (BOXES.some(box => box.isUnderMouse(mouseX, mouseY))) {
      CANVAS.style.cursor = 'grab'
    } else {
      CANVAS.style.cursor = 'default'
    }
  }
})

// Evento de soltar el ratón (mouseup)
CANVAS.addEventListener('mouseup', (e) => {
  if (draggedBox) {
    const mouseX = e.offsetX
    const mouseY = e.offsetY
    const zone = ZONES.find(zone => zone.isInside(mouseX, mouseY))

    if (zone) {
      const exchangedBox = zone.exchangeBox(draggedBox)
      if (exchangedBox && originalZone) {
        originalZone.placeBox(exchangedBox)
      } else if (exchangedBox) {
        exchangedBox.resetPosition()
      }
    } else {
      draggedBox.resetPosition()
      if (originalZone) {
        originalZone.removeBox()
      }
    }

    draggedBox = null
    originalZone = null
    CANVAS.style.cursor = 'default'
  }
})

// Evento de salida del ratón del canvas (mouseleave)
CANVAS.addEventListener('mouseleave', () => {
  if (draggedBox) {
    if (originalZone) {
      originalZone.placeBox(draggedBox)
    } else {
      draggedBox.resetPosition()
    }
    draggedBox = null
    originalZone = null
    CANVAS.style.cursor = 'default'
  }
})

// Inicializar el juego
init()
