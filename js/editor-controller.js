'use strict'
var gElCanvas
var gCtx

function onInit() {
  renderGallery()
}

function onRenderEditor(id) {
  document.querySelector('.editor').classList.remove('hidden')
  document.querySelector('.gallery').classList.add('hidden')
  setMeme(id)
  renderMeme()
}

function renderMeme() {
  const meme = getMeme()
  const img = getImgById(meme.selectedImgId)

  renderCanvas()
  const elImg = new Image()
  elImg.src = img.url
  //   elImg.dataset.id = img.id

  elImg.onload = () => {
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
    const memeText = meme.lines[meme.selectedLineIdx].txt
    drawText(memeText)
  }
}

function renderCanvas() {
  gElCanvas = document.querySelector('canvas')
  gCtx = gElCanvas.getContext('2d')

  //4:3 ratio
  gElCanvas.width = window.innerWidth * 0.4
  gElCanvas.height = gElCanvas.width * 0.75

  gCtx.fillStyle = '#f4f4f4'
  gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function drawText(txt) {
  const meme = getMeme()
  const memeFontSize = meme.lines[meme.selectedLineIdx].size
  const memeFontColor = meme.lines[meme.selectedLineIdx].color
  //   const fontSize = gElCanvas.height * 0.08
  gCtx.font = `${memeFontSize}px Impact`
  gCtx.textAlign = 'center'
  gCtx.textBaseline = 'top'

  gCtx.lineWidth = memeFontSize / 20

  gCtx.strokeStyle = 'black'
  gCtx.fillStyle = memeFontColor

  //put the txt constant
  const x = gElCanvas.width / 2
  const y = gElCanvas.height * 0.1

  gCtx.fillText(txt, x, y)
  gCtx.strokeText(txt, x, y)
}

function onSetLineTxt(value) {
  setLineText(value)
  renderMeme()
}
