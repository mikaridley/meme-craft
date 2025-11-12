'use strict'

var gImgs = []
_createImgs()

var gMeme = _createMeme(1)
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
  })
}

//set things
function setLineText(value) {
  const lineIdx = gMeme.selectedLineIdx
  gMeme.lines[lineIdx].txt = value
}

function setPositionToLine(idx, x, y, textWidth, textHeight) {
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
  if (!idx) {
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
  gMeme.lines[lineIdx].pos.x += 5
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
