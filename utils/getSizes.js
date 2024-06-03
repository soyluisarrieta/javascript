// Get sizes
export default function sizes() {
  const contentWidth = [...document.body.children].reduce(
    (a, el) => Math.max(a, el.getBoundingClientRect().right), 0)
    - document.body.getBoundingClientRect().x

  return {
    windowWidth: document.documentElement.clientWidth,
    windowHeight: document.documentElement.clientHeight,
    pageWidth: Math.min(document.body.scrollWidth, contentWidth),
    pageHeight: document.body.scrollHeight,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    pageX: document.body.getBoundingClientRect().x,
    pageY: document.body.getBoundingClientRect().y,
    screenX: -window.screenX,
    screenY: -window.screenY - (window.outerHeight - window.innerHeight),
  }
}