'use strict'

const MEME_KEY = 'memeDB'
var gImgs = getImgsFromDB()

var gSavedMemes = loadFromStorage(MEME_KEY) || []
var gMeme = {}
var gKeywordSearchCountMap = { funny: 12, cat: 16, baby: 2 }

//create things
function _createMeme(id, url) {
  return {
    selectedImgId: id,
    selectedLineIdx: 0,
    url,
    lines: [
      {
        txt: 'Insert Text',
        size: 60,
        color: 'white',
        pos: {},
        align: 'center',
        isChangedManuly: false,
        isDraged: false,
      },
    ],
  }
}

function _createImg(url, keyWords) {
  return {
    id: generateRandomID(),
    url,
    keywords: ['funny', 'cat'],
  }
}

function _createImgs(amount) {
  for (var i = 1; i <= amount; i++) {
    var url = `img/${i}.jpg`
    gImgs.push(_createImg(url))
  }
}

function createUploadedImg(img) {
  gImgs.push(_createImg(img))
}

function _createLine() {
  gMeme.lines.push({
    txt: 'Insert Text',
    size: 60,
    color: 'white',
    pos: {},
    align: 'center',
    isChangedManuly: false,
    isDraged: false,
  })
}

//set things
function setLineText(value) {
  const lineIdx = gMeme.selectedLineIdx
  gMeme.lines[lineIdx].txt = value
}

function setPositionToLine(idx, xStart, x, y, textWidth, textHeight) {
  gMeme.lines[idx].pos = { x, y, xStart, textWidth, textHeight }
}

function setMeme(id, url, state) {
  if (state === 'create' || 'upload') gMeme = _createMeme(id, url)
  else if (state === 'edit') {
    gMeme = _editMeme(id, url)
  }
}

function changeColor(color) {
  const lineIdx = gMeme.selectedLineIdx
  gMeme.lines[lineIdx].color = color
}

function decreaseFont() {
  const lineIdx = gMeme.selectedLineIdx
  gMeme.lines[lineIdx].size -= 2
}

function increaseFont() {
  const lineIdx = gMeme.selectedLineIdx
  gMeme.lines[lineIdx].size += 2
}

function addLine() {
  _createLine()
  gMeme.selectedLineIdx = 1
}

function switchLine(idx = null) {
  if (idx === null) {
    gMeme.selectedLineIdx++
    if (gMeme.selectedLineIdx >= gMeme.lines.length) gMeme.selectedLineIdx = 0
  } else gMeme.selectedLineIdx = idx
}

function setLeftText() {
  const lineIdx = gMeme.selectedLineIdx
  gMeme.lines[lineIdx].align = 'left'
}

function setCenterText() {
  const lineIdx = gMeme.selectedLineIdx
  gMeme.lines[lineIdx].align = 'center'
}

function setRightText() {
  const lineIdx = gMeme.selectedLineIdx
  gMeme.lines[lineIdx].align = 'right'
}

function setManualText() {
  const lineIdx = gMeme.selectedLineIdx
  gMeme.lines[lineIdx].align = 'manual'
}

function moveTextUp() {
  const lineIdx = gMeme.selectedLineIdx
  setIsChangedManuly(true)
  gMeme.lines[lineIdx].pos.y -= 10
}

function moveTextDown() {
  const lineIdx = gMeme.selectedLineIdx
  setIsChangedManuly(true)
  gMeme.lines[lineIdx].pos.y += 10
}

function deleteLine() {
  const lineIdx = gMeme.selectedLineIdx
  gMeme.lines.splice(lineIdx, 1)
}

function setIsChangedManuly(state) {
  gMeme.lines[gMeme.selectedLineIdx].isChangedManuly = state
}

function _editMeme(id, url) {
  const meme = getMemeById(id)
  return {
    selectedImgId: id,
    selectedLineIdx: meme.selectedLineIdx,
    url,
    lines: meme.lines,
  }
}

function setTextDrag(lineIndex, isDrag) {
  gMeme.lines[lineIndex].isDraged = isDrag
}

function moveText(lineIndex, dx, dy) {
  gMeme.lines[lineIndex].pos.x += dx
  gMeme.lines[lineIndex].pos.y += dy
}

//get things
function getMeme() {
  return gMeme
}

function getImgs() {
  return gImgs
}

function getImgById(id) {
  var img = gImgs.find(img => img.id === id)
  return img
}

function getSavedMemes() {
  return gSavedMemes
}

function getMemeById(id) {
  const meme = gSavedMemes.find(meme => meme.selectedImgId === id)
  return meme
}

function getIdxMemeById(id) {
  const index = gSavedMemes.findIndex(meme => meme.selectedImgId === id)
  return index
}

//remove things
function removeMeme(id) {
  const index = getIdxMemeById(id)
  if (index !== -1) gSavedMemes.splice(index, 1)
  saveToStorage(MEME_KEY, gSavedMemes)
}

//storage
function saveMeme(data) {
  const memeToSave = { ...gMeme, data }
  gSavedMemes.push(memeToSave)
  saveToStorage(MEME_KEY, gSavedMemes)
}
