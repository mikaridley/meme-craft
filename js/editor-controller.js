'use strict'
let gElCanvas
let gCtx
const BASE_CANVAS_HEIGHT = 500
let gStartPos = { line: -1, pos: null }
let isTextClicked = true
let isTextDraged = false

//render things
function renderMeme(isForDownload = false) {
  if (document.querySelector('.editor').classList.contains('hidden')) return
  const meme = getMeme()

  let img = getImgById(meme.selectedImgId)
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
  const padding = 20
  gCtx.font = `${scaledSize}px Impact`
  gCtx.textAlign = 'center'
  gCtx.textBaseline = 'top'
  gCtx.lineWidth = scaledSize / 20
  gCtx.strokeStyle = 'black'
  gCtx.fillStyle = memeline.color

  //set the align text the x
  let x
  if (memeline.align === 'left') x = gElCanvas.width / 2 - gElCanvas.width * 0.2
  else if (memeline.align === 'right')
    x = gElCanvas.width / 2 + gElCanvas.width * 0.2
  else if (memeline.align === 'center') x = gElCanvas.width / 2
  else if (memeline.align === 'manual') x = memeline.pos.x

  let y
  if (!memeline.isChangedManuly) {
    //set the position - the y
    if (position === 'top') y = gElCanvas.height * 0.1
    else if (position === 'bottom') y = gElCanvas.height * 0.8
    else if ('middle') y = gElCanvas.height / 2
  } else y = memeline.pos.y

  const textMetrics = gCtx.measureText(memeline.txt)
  const textWidth = textMetrics.width
  // const textHeight = memeline.size
  const textHeight = scaledSize
  const xStart = x - textWidth / 2
  const xEnd = x + textWidth / 2

  //prevent the text from overflow on x
  if (xStart < padding) x = padding + textWidth / 2
  if (xEnd > gElCanvas.width - padding)
    x = gElCanvas.width - padding - textWidth / 2

  // const yStart = y - textHeight / 2
  // const yEnd = y + textHeight / 2
  // console.log(`y   ${yStart},  ${y},  ${yEnd}`)
  // if (yStart < 10) y = 10 + textHeight / 2
  // if (yEnd > gElCanvas.height - 10) y = gElCanvas.height - 10 - textHeight / 2

  setPositionToLine(idx, xStart, x, y, textWidth, textHeight)

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
  let meme = getMeme()
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
  document.querySelector('.gallery-search-container').classList.add('hidden')

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
  isTextClicked = true
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

function onCanvaClick(ev) {
  const pos = { x: ev.offsetX, y: ev.offsetY }
  const line = whichTextClicked(pos)
  if (line === -1) isTextClicked = false
  else isTextClicked = true
  switchLine(line)
  renderMeme()
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

  switchLine(line)
  setIsChangedManuly(true)
  setTextDrag(line, true)
  setManualText()

  isTextDraged = true
  //Save the pos we start from
  gStartPos.pos = pos
  gStartPos.line = line

  document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
  if (gStartPos.line === -1) return
  const memeLines = getMeme().lines
  const index = memeLines.findIndex(line => line.isDraged)
  const line = memeLines[index]

  if (!line) return

  const pos = getEvPos(ev)
  // Calc the delta, the diff we moved
  const dx = pos.x - gStartPos.pos.x
  const dy = pos.y - gStartPos.pos.y
  moveText(index, dx, dy)
  // Save the last pos, we remember where we`ve been and move accordingly
  gStartPos.pos = pos
  // The canvas is render again after every move
  renderMeme()
}

function onUp() {
  setTextDrag(gStartPos.line, false)

  gStartPos.pos = null
  isTextDraged = false
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

function onImgReady() {
  renderMeme(true)
  document.querySelector('.done-btn').classList.add('hidden')
  document.querySelector('.download-btn').classList.remove('hidden')
  document.querySelector('.share-btn').classList.remove('hidden')
  switchLine(-1)
}

function onDownloadImg(elLink) {
  const imgContent = gElCanvas.toDataURL('image/jpeg')
  elLink.href = imgContent
  document.querySelector('.done-btn').classList.remove('hidden')
  document.querySelector('.download-btn').classList.add('hidden')
  document.querySelector('.share-btn').classList.add('hidden')
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

function onShareImg(ev) {
  document.querySelector('.done-btn').classList.remove('hidden')
  document.querySelector('.download-btn').classList.add('hidden')
  document.querySelector('.share-btn').classList.add('hidden')

  ev.preventDefault()
  const canvasData = gElCanvas.toDataURL('image/jpeg')

  // After a succesful upload, allow the user to share on Facebook
  function onSuccess(uploadedImgUrl) {
    const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
    console.log('encodedUploadedImgUrl:', encodedUploadedImgUrl)
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`
    )
  }
  uploadImg(canvasData, onSuccess)
}

async function uploadImg(imgData, onSuccess) {
  const CLOUD_NAME = 'webify'
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
  const formData = new FormData()
  formData.append('file', imgData)
  formData.append('upload_preset', 'webify')
  try {
    const res = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()
    console.log('Cloudinary response:', data)
    onSuccess(data.secure_url)
  } catch (err) {
    console.log(err)
  }
}

//other
function whichTextClicked(pos) {
  const { x, y } = pos
  const memeLines = getMeme().lines
  const line = memeLines.findIndex(line => {
    return (
      x >= line.pos.xStart &&
      x <= line.pos.xStart + line.pos.textWidth &&
      y >= line.pos.y &&
      y <= line.pos.y + line.pos.textHeight
    )
  })

  if (line !== -1) {
    document.querySelector('.done-btn').classList.remove('hidden')
    document.querySelector('.download-btn').classList.add('hidden')
    document.querySelector('.share-btn').classList.add('hidden')
  }
  return line
}
