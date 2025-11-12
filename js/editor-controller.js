'use strict'
var gElCanvas
var gCtx

function onInit() {
  renderGallery()
}

//render things

function renderMeme(isForDownload = false) {
  const meme = getMeme()
  const img = getImgById(meme.selectedImgId)

  const elImg = new Image()
  elImg.src = img.url
  const ratio = +elImg.naturalHeight / +elImg.naturalWidth
  renderCanvas(ratio)

  elImg.onload = () => {
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

function drawText(memeline, idx, position, isForDownload) {
  const selectedId = getMeme().selectedLineIdx
  gCtx.font = `${memeline.size}px Impact`
  gCtx.textAlign = 'center'
  gCtx.textBaseline = 'top'

  gCtx.lineWidth = memeline.size / 20

  gCtx.strokeStyle = 'black'
  gCtx.fillStyle = memeline.color

  //set the align text
  if (memeline.align === 'left')
    var x = gElCanvas.width / 2 - gElCanvas.width * 0.2
  else if (memeline.align === 'right')
    var x = gElCanvas.width / 2 + gElCanvas.width * 0.2
  else var x = gElCanvas.width / 2

  //set the position
  if (position === 'top') var y = gElCanvas.height * 0.1
  else if (position === 'bottom') var y = gElCanvas.height * 0.8
  else if ('middle') var y = gElCanvas.height / 2

  const textMetrics = gCtx.measureText(memeline.txt)
  const textWidth = textMetrics.width
  const textHeight = memeline.size
  const xStart = x - textWidth / 2
  setPositionToLine(idx, xStart, y, textWidth, textHeight)

  gCtx.fillText(memeline.txt, x, y)
  gCtx.strokeText(memeline.txt, x, y)

  if (idx === selectedId && !isForDownload) drawFrame(memeline, x, y)
}

function drawFrame(memeline, x, y, state) {
  const textMetrics = gCtx.measureText(memeline.txt)
  const textWidth = textMetrics.width
  const textHeight = memeline.size // approximate height

  const padding = 10
  const rectX = x - textWidth / 2 - padding
  const rectY = y - padding / 2
  const rectWidth = textWidth + padding * 2
  const rectHeight = textHeight + padding

  gCtx.lineWidth = 3
  gCtx.strokeStyle = 'black'
  gCtx.strokeRect(rectX, rectY, rectWidth, rectHeight)
}

function renderAllTextLines(isForDownload) {
  var memeLines = getMeme().lines
  drawText(memeLines[0], 0, 'top', isForDownload)
  if (memeLines[1]) drawText(memeLines[1], 1, 'bottom', isForDownload)
  // if (memeLines[2]) {
  //   memeLines.splice(0, 2)
  //   memeLines.forEach(line => {
  //     if (line) drawText(line.txt, 'middle')
  //   })
  // }
}

//on things
function onRenderEditor(id) {
  document.querySelector('.editor').classList.remove('hidden')
  document.querySelector('.gallery').classList.add('hidden')
  setMeme(id)
  renderMeme()
}

function onSetLineTxt(value) {
  setLineText(value)
  renderMeme()
}

function onChangeColor(color) {
  changeColor(color)
  renderMeme()
}

function onDecreaseFont() {
  decreaseFont()
  renderMeme()
}

function onIncreaseFont() {
  increaseFont()
  renderMeme()
}

function onAddLine() {
  addLine()
  renderMeme()
}

function onSwitchLine() {
  switchLine()
  renderMeme()
}

function onSetLeftText() {
  setLeftText()
  renderMeme()
}

function onSetCenterText() {
  setCenterText()
  renderMeme()
}

function onSetRightText() {
  setRightText()
  renderMeme()
}

function onMoveTextUp() {
  moveTextUp()
  renderMeme()
}

function onMoveTextDown() {
  moveTextDown()
  renderMeme()
}

function onImgReady() {
  renderMeme(true)
}

function onDownloadImg(elLink) {
  const imgContent = gElCanvas.toDataURL('image/jpeg')
  elLink.href = imgContent
}

function onCanvaClick(ev) {
  const { offsetX, offsetY } = ev
  const memeLines = getMeme().lines
  const line = memeLines.findIndex(line => {
    return (
      offsetX >= line.pos.x &&
      offsetX <= line.pos.x + line.pos.textWidth &&
      offsetY >= line.pos.y &&
      offsetY <= line.pos.y + line.pos.textHeight
    )
  })
  switchLine(line)
  renderMeme()
}
