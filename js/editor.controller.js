'use strict'
let gElCanvas
let gCtx
const BASE_CANVAS_HEIGHT = 500
let gStartPos = { line: -1, pos: null }
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
    renderLineSetting()
  }
}

function renderCanvas(ratio) {
  gElCanvas = document.querySelector('canvas')
  gCtx = gElCanvas.getContext('2d')

  // 4:3 ratio
  gElCanvas.width = window.innerWidth * 0.4
  gElCanvas.height = gElCanvas.width * ratio
  //mq
  if (window.innerWidth <= 1100) {
    gElCanvas.width = window.innerWidth * 0.9
    gElCanvas.height = gElCanvas.width * ratio
  } else if (window.innerWidth >= 1700) {
    gElCanvas.width = 700
    gElCanvas.height = gElCanvas.width * ratio
  }
}

function renderLineSetting() {
  const meme = getMeme()
  const memeLine = meme.lines[meme.selectedLineIdx]
  if (!memeLine) return

  const elColor = document.querySelector('.color')
  elColor.value = memeLine.color

  const elText = document.querySelector('.text-input')
  elText.value = memeLine.txt
}

function onResize() {
  renderMeme()
}

function drawText(memeline, idx, Ypos, isForDownload) {
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
    if (Ypos === 'top') y = gElCanvas.height * 0.1
    else if (Ypos === 'bottom') y = gElCanvas.height * 0.8
    else if ('middle') y = gElCanvas.height / 2
  } else y = memeline.pos.y

  const textMetrics = gCtx.measureText(memeline.txt)
  const textWidth = textMetrics.width
  const textHeight = scaledSize

  const xStart = x - textWidth / 2
  const xEnd = x + textWidth / 2

  //prevent the text from overflow on x
  if (xStart < padding) x = padding + textWidth / 2
  if (xEnd > gElCanvas.width - padding)
    x = gElCanvas.width - padding - textWidth / 2

  // setPositionToLine(idx, x, y, textWidth, textHeight)

  //rotation part
  if (memeline.rotation !== 0) {
    gCtx.save()
    gCtx.translate(x, y + textHeight / 2)
    gCtx.rotate(((memeline.rotation || 0) * Math.PI) / 180)
    gCtx.fillText(memeline.txt, 0, -textHeight / 2)
    gCtx.strokeText(memeline.txt, 0, -textHeight / 2)
    gCtx.restore()
  } else {
    gCtx.fillText(memeline.txt, x, y)
    gCtx.strokeText(memeline.txt, x, y)
  }

  if (idx === selectedId && !isForDownload) drawFrame(memeline, idx, x, y)
}

function drawFrame(memeline, idx, x, y) {
  const scaleFactor = gElCanvas.height / BASE_CANVAS_HEIGHT
  const scaledSize = memeline.size * scaleFactor

  const textMetrics = gCtx.measureText(memeline.txt)
  const textWidth = textMetrics.width
  const textHeight = scaledSize

  const padding = 10
  let rectX
  let rectY
  let rectWidth
  let rectHeight
  if (memeline.rotation === 0 || memeline.rotation === 180) {
    rectX = x - textWidth / 2 - padding
    rectY = y - padding / 2
    rectWidth = textWidth + padding * 2
    rectHeight = textHeight + padding
  } else {
    rectX = x - textHeight / 2 - padding
    rectY = y - textWidth / 2 + padding * 2
    rectWidth = textHeight + padding * 2
    rectHeight = textWidth + padding
  }

  setPositionToLine(idx, x, y, rectX, rectY, rectWidth, rectHeight)

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
  if (document.body.classList.contains('menu-open')) toggleMenu()
  renderMeme()
}

function onSetLineTxt(value) {
  if (getLineIndex() === -1) return
  setLineText(value)
  renderMeme()
}

function onChangeColor(color) {
  if (getLineIndex() === -1) return
  changeColor(color)
  renderMeme()
}

function onDecreaseFont() {
  if (getLineIndex() === -1) return
  decreaseFont()
  renderMeme()
}

function onIncreaseFont() {
  if (getLineIndex() === -1) return
  increaseFont()
  renderMeme()
}

function onAddLine() {
  addLine()
  switchLine()
  renderMeme()
}

function onSwitchLine() {
  if (getLineIndex() === -1) return
  switchLine()
  renderMeme()
}

function onRotateLine() {
  if (getLineIndex() === -1) return
  rotateLine()
  renderMeme()
}

function onSetLeftText() {
  if (getLineIndex() === -1) return
  setLeftText()
  renderMeme()
}

function onSetCenterText() {
  if (getLineIndex() === -1) return
  setCenterText()
  renderMeme()
}

function onSetRightText() {
  if (getLineIndex() === -1) return
  setRightText()
  renderMeme()
}

function onMoveTextUp() {
  if (getLineIndex() === -1) return
  moveTextUp()
  renderMeme()
}

function onMoveTextDown() {
  if (getLineIndex() === -1) return
  moveTextDown()
  renderMeme()
}

function onMoveTextDown() {
  if (getLineIndex() === -1) return
  moveTextDown()
  renderMeme()
}

function onDeleteLine() {
  if (getLineIndex() === -1) return
  deleteLine()
  renderMeme()
}

function onCanvaClick(ev) {
  const pos = { x: ev.offsetX, y: ev.offsetY }
  const lineIndex = whichTextClicked(pos)
  switchLine(lineIndex)
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
  const rect = gElCanvas.getBoundingClientRect()
  let x, y

  if (ev.type.startsWith('touch')) {
    ev.preventDefault()
    const touch = ev.changedTouches[0]
    x = touch.clientX - rect.left
    y = touch.clientY - rect.top
  } else {
    x = ev.clientX - rect.left
    y = ev.clientY - rect.top
  }

  return { x, y }
}

function onImgReady() {
  renderMeme(true)
  switchLine(-1)
  document.querySelector('.done-btn').classList.add('hidden')
  document.querySelector('.download-btn').classList.remove('hidden')
  document.querySelector('.facebook-btn').classList.remove('hidden')
  document.querySelector('.other-btn').classList.remove('hidden')
  document.querySelector('.save-btn').classList.remove('hidden')
}

function onDownloadImg(elLink) {
  const imgContent = gElCanvas.toDataURL('image/jpeg')
  elLink.href = imgContent

  renderDoneBtn()
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
  renderDoneBtn()
}

function onShareOnFacebook(ev) {
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
  renderDoneBtn()
}

async function onOtherShare() {
  const canvas = gElCanvas

  // Convert canvas to a blob
  canvas.toBlob(async blob => {
    const file = new File([blob], 'meme.png', { type: 'image/png' })

    try {
      await navigator.share({
        title: 'My Meme',
        text: 'Check out my meme!',
        files: [file],
      })
      console.log('Meme shared successfully!')
    } catch (err) {
      console.log('Share cancelled or failed:', err)
    }
  })

  renderDoneBtn()
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
  const meme = getMeme()

  var line = meme.lines.findIndex(line => {
    // const xStart = line.pos.x - 120
    return (
      x >= line.pos.rectX &&
      x <= line.pos.rectX + line.pos.textWidth &&
      y >= line.pos.rectY &&
      y <= line.pos.rectY + line.pos.textHeight
    )
  })
  if (line !== -1) renderDoneBtn()
  return line
}

function renderDoneBtn() {
  document.querySelector('.done-btn').classList.remove('hidden')
  document.querySelector('.download-btn').classList.add('hidden')
  document.querySelector('.facebook-btn').classList.add('hidden')
  document.querySelector('.other-btn').classList.add('hidden')
  document.querySelector('.save-btn').classList.add('hidden')
}
