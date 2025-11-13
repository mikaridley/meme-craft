'use strict'

const MEME_KEY = 'memeDB'
var gImgs = []
_createImgs()

var gSavedMemes = loadFromStorage(MEME_KEY)
var gMeme = {}
var gKeywordSearchCountMap = { funny: 12, cat: 16, baby: 2 }

//create things
function _createMeme(id) {
  return {
    selectedImgId: id,
    selectedLineIdx: 0,
    lines: [
      {
        txt: 'Insert Text',
        size: 50,
        color: 'white',
        pos: {},
        align: 'center',
        isChangedManuly: false,
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

function _createImgs() {
  for (var i = 1; i <= 18; i++) {
    var url = `img/${i}.jpg`
    gImgs.push(_createImg(url))
  }
}

function _createLine() {
  gMeme.lines.push({
    txt: 'Insert Text',
    size: 50,
    color: 'white',
    pos: {},
    align: 'center',
    isChangedManuly: false,
  })
}

//set things
function setLineText(value) {
  const lineIdx = gMeme.selectedLineIdx
  gMeme.lines[lineIdx].txt = value
}

function setPositionToLine(idx, x, y, textWidth, textHeight) {
  // const lineIdx = gMeme.selectedLineIdx
  // if (Object.keys(gMeme.lines[lineIdx].pos).length === 0)
  gMeme.lines[idx].pos = { x, y, textWidth, textHeight }
}

function setMeme(id) {
  gMeme = _createMeme(id)
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

function moveTextUp() {
  const lineIdx = gMeme.selectedLineIdx
  gMeme.lines[lineIdx].isChangedManuly = true
  gMeme.lines[lineIdx].pos.y -= 10
}

function moveTextDown() {
  const lineIdx = gMeme.selectedLineIdx
  gMeme.lines[lineIdx].isChangedManuly = true
  gMeme.lines[lineIdx].pos.y += 10
}

function deleteLine() {
  const lineIdx = gMeme.selectedLineIdx
  gMeme.lines.splice(lineIdx, 1)
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

function getIdxMemeById(id) {
  const index = gSavedMemes.findIndex(meme => meme.selectedImgId === id)
  return index
}

//remove things
function removeMeme(id) {
  const index = getIdxMemeById(id)
  console.log('index:', index)
  if (index !== -1) gSavedMemes.splice(index, 1)
  saveToStorage(MEME_KEY, gSavedMemes)
}

//storage
function saveMeme(data) {
  const memeToSave = { ...gMeme, data }
  gSavedMemes.push(memeToSave)
  saveToStorage(MEME_KEY, gSavedMemes)
}
