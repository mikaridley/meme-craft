'use strict'

var gImgs = []
_createImgs()

var gMeme = _createMeme(1)
console.log('gMeme:', gMeme)
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
      },
    ],
  }
}

function _createImg(url, keyWords) {
  return {
    id: generateRandomID(),
    // url: `img/${name}.jpg`,
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

//set things
function setLineText(value, line) {
  gMeme.lines[0].txt = value
}

function setMeme(id) {
  console.log('id:', id)
  gMeme = _createMeme(id)
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
