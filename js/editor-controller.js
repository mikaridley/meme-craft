'use strict'
var gElCanvas
var gCtx
const BASE_CANVAS_HEIGHT = 500
let gStartPos
let isTextClicked = false

//render things
function renderMeme(isForDownload = false) {
  if (document.querySelector('.editor').classList.contains('hidden')) return
  const meme = getMeme()

  var img = getImgById(meme.selectedImgId)
  if (!img) img = getMemeById(meme.selectedImgId)
  if (!img) img = meme

  const elImg = new Image()
  elImg.src = img.url

  elImg.onload = () => {
    const ratio = +elImg.naturalHeight / +elImg.naturalWidth
    renderCanvas(ratio)
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
    renderAllTextLines(isForDownload)
  }
}

function renderCanvas(ratio) {
  gElCanvas = document.querySelector('canvas')
  gCtx = gElCanvas.getContext('2d')

  //4:3 ratio
  gElCanvas.width = window.innerWidth * 0.4
  gElCanvas.height = gElCanvas.width * ratio
}

function onResize() {
  renderMeme()
}

function drawText(memeline, idx, position, isForDownload) {
  if (!memeline) return
  const scaleFactor = gElCanvas.height / BASE_CANVAS_HEIGHT
  const scaledSize = memeline.size * scaleFactor

  const selectedId = getMeme().selectedLineIdx
  gCtx.font = `${scaledSize}px Impact`
  gCtx.textAlign = 'center'
  gCtx.textBaseline = 'top'

  gCtx.lineWidth = scaledSize / 20

  gCtx.strokeStyle = 'black'
  gCtx.fillStyle = memeline.color

  //set the align text the x
  if (memeline.align === 'left')
    var x = gElCanvas.width / 2 - gElCanvas.width * 0.2
  else if (memeline.align === 'right')
    var x = gElCanvas.width / 2 + gElCanvas.width * 0.2
  else var x = gElCanvas.width / 2

  //set the position - the y
  if (!memeline.isChangedManuly) {
    if (position === 'top') var y = gElCanvas.height * 0.1
    else if (position === 'bottom') var y = gElCanvas.height * 0.8
    else if ('middle') var y = gElCanvas.height / 2
  } else var y = memeline.pos.y

  const textMetrics = gCtx.measureText(memeline.txt)
  const textWidth = textMetrics.width
  const textHeight = memeline.size
  const xStart = x - textWidth / 2
  setPositionToLine(idx, xStart, y, textWidth, textHeight)

  gCtx.fillText(memeline.txt, x, y)
  gCtx.strokeText(memeline.txt, x, y)

  if (idx === selectedId && !isForDownload) drawFrame(memeline, x, y)
}

function drawFrame(memeline, x, y) {
  const scaleFactor = gElCanvas.height / BASE_CANVAS_HEIGHT
  const scaledSize = memeline.size * scaleFactor

  const textMetrics = gCtx.measureText(memeline.txt)
  const textWidth = textMetrics.width
  const textHeight = scaledSize

  const padding = 10
  const rectX = x - textWidth / 2 - padding
  const rectY = y - padding / 2
  const rectWidth = textWidth + padding * 2
  const rectHeight = textHeight + padding

  gCtx.lineWidth = 3
  gCtx.strokeStyle = '#00ffb6'
  gCtx.strokeRect(rectX, rectY, rectWidth, rectHeight)
}

function renderAllTextLines(isForDownload) {
  var meme = getMeme()
  meme.lines.forEach((line, idx) => {
    if (idx === 0) drawText(line, 0, 'top', isForDownload)
    else if (idx === 1) drawText(line, 1, 'bottom', isForDownload)
    else drawText(line, idx, 'middle', isForDownload)
  })
}

//on things
function onRenderEditor(id, url, state) {
  document.querySelector('.editor').classList.remove('hidden')
  document.querySelector('.gallery').classList.add('hidden')
  document.querySelector('.saved-memes').classList.add('hidden')
  document.querySelector('.about').classList.add('remove')
  setMeme(id, url, state)
  renderMeme()
}

function onSetLineTxt(value) {
  if (!isTextClicked) return
  setLineText(value)
  renderMeme()
}

function onChangeColor(color) {
  if (!isTextClicked) return
  changeColor(color)
  renderMeme()
}

function onDecreaseFont() {
  if (!isTextClicked) return
  decreaseFont()
  renderMeme()
}

function onIncreaseFont() {
  if (!isTextClicked) return
  increaseFont()
  renderMeme()
}

function onAddLine() {
  addLine()
  renderMeme()
}

function onSwitchLine() {
  if (!isTextClicked) return
  switchLine()
  renderMeme()
}

function onSetLeftText() {
  if (!isTextClicked) return
  setLeftText()
  renderMeme()
}

function onSetCenterText() {
  if (!isTextClicked) return
  setCenterText()
  renderMeme()
}

function onSetRightText() {
  if (!isTextClicked) return
  setRightText()
  renderMeme()
}

function onMoveTextUp() {
  if (!isTextClicked) return
  moveTextUp()
  renderMeme()
}

function onMoveTextDown() {
  if (!isTextClicked) return
  moveTextDown()
  renderMeme()
}

function onMoveTextDown() {
  if (!isTextClicked) return
  moveTextDown()
  renderMeme()
}

function onDeleteLine() {
  if (!isTextClicked) return
  deleteLine()
  renderMeme()
}

function onImgReady() {
  renderMeme(true)
  document.querySelector('.done-btn').classList.add('hidden')
  document.querySelector('.download-btn').classList.remove('hidden')
}

function onDownloadImg(elLink) {
  const imgContent = gElCanvas.toDataURL('image/jpeg')
  elLink.href = imgContent
  document.querySelector('.done-btn').classList.remove('hidden')
  document.querySelector('.download-btn').classList.add('hidden')
}

function onCanvaClick(ev) {
  const pos = { x: ev.offsetX, y: ev.offsetY }
  const line = whichTextClicked(pos)
  if (line === -1) isTextClicked = false
  else isTextClicked = true
  console.log('line:', line)
  switchLine(line)
  renderMeme()
}

function onSaveMeme() {
  const savedMemes = getSavedMemes()
  if (savedMemes.length >= 8) {
    onOpenModal('Not enough space')
    return
  }
  const dataURL = gElCanvas.toDataURL()
  // if (dataURL.length > 100) {
  //   console.log('dataURL:', dataURL)
  //   onOpenModal("Can't save uploaded images")
  //   return
  // }
  saveMeme(dataURL)
  onOpenModal('Meme Saved')
}

function onOpenModal(txt) {
  const modal = document.querySelector('.modal-meme-saved')
  modal.innerText = txt
  modal.show()
  setTimeout(() => {
    modal.close()
  }, 2000)
}

function onDown(ev) {
  const pos = getEvPos(ev)
  const line = whichTextClicked(pos)

  if (line === -1) return

  setTextDrag(line, true)
  //Save the pos we start from
  gStartPos = pos
  document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
  const memeLines = getMeme().lines
  const index = memeLines.findIndex(line => line.isDraged)
  const line = memeLines[index]
  console.log('line:', line)

  if (!line) return
  console.log('onMove')

  const pos = getEvPos(ev)
  console.log('pos', pos)
  // Calc the delta, the diff we moved
  const dx = pos.x - gStartPos.x
  const dy = pos.y - gStartPos.y
  moveText(index, dx, dy)
  // Save the last pos, we remember where we`ve been and move accordingly
  gStartPos = pos
  // The canvas is render again after every move
  renderMeme()
}

function onUp() {
  const line = whichTextClicked(pos)
  setTextDrag(line, false)
  document.body.style.cursor = 'grab'
}

function getEvPos(ev) {
  const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

  let pos = {
    x: ev.offsetX,
    y: ev.offsetY,
  }

  if (TOUCH_EVS.includes(ev.type)) {
    // Prevent triggering the mouse ev
    ev.preventDefault()
    // Gets the first touch point
    ev = ev.changedTouches[0]
    // Calc the right pos according to the touch screen
    pos = {
      x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
      y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
    }
  }
  return pos
}

//other
function whichTextClicked(pos) {
  const { x, y } = pos
  console.log(`curr tauch:   ${x},${y}`)
  const memeLines = getMeme().lines
  const line = memeLines.findIndex(line => {
    return (
      x >= line.pos.x &&
      x <= line.pos.x + line.pos.textWidth &&
      y >= line.pos.y &&
      y <= line.pos.y + line.pos.textHeight
    )
  })
  return line
}
