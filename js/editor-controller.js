'use strict'
var gElCanvas
var gCtx

function onInit() {
  renderGallery()
}

//render things

function renderMeme(isForDownload = false) {
  if (document.querySelector('.editor').classList.contains('hidden')) return
  const meme = getMeme()
  var img = getImgById(meme.selectedImgId)
  if (!img) img = getMemeById(meme.selectedImgId)

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
  if (!memeline) return
  const selectedId = getMeme().selectedLineIdx
  gCtx.font = `${memeline.size}px Impact`
  gCtx.textAlign = 'center'
  gCtx.textBaseline = 'top'

  gCtx.lineWidth = memeline.size / 20

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
  setMeme(id, url, state)
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

function onMoveTextDown() {
  moveTextDown()
  renderMeme()
}

function onDeleteLine() {
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

function onSaveMeme() {
  const savedMemes = getSavedMemes()
  if (gSavedMemes.length >= 8) {
    onOpenModal('Not enough space')
    return
  }
  const dataURL = gElCanvas.toDataURL()
  saveMeme(dataURL)
  onOpenModal('Meme Saved')
}

function onOpenModal(txt) {
  const modal = document.querySelector('.modal-meme-saved')
  modal.innerText = txt
  modal.showModal()
  setTimeout(() => {
    modal.close()
  }, 1000)
}
