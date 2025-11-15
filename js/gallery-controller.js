'use strict'

let filteredImgs = getImgs()

function onInit() {
  onRenderGallery()
}

function onRenderGallery() {
  document.querySelector('.gallery').classList.remove('hidden')
  document.querySelector('.gallery-search-container').classList.remove('hidden')
  document.querySelector('.editor').classList.add('hidden')
  document.querySelector('.saved-memes').classList.add('hidden')
  document.querySelector('.about').classList.add('hidden')
  renderGallery()
}

function renderGallery() {
  const elGallery = document.querySelector('.gallery')
  let strHtml = `<div class="upload-img">
          <label for="upload">Upload</label>
          <input
            type="file"
            id="upload"
            class="hidden btn"
            name="image"
            onchange="onImgInput(event)"
          />
        </div>`
  let imgs = filteredImgs.map(img => {
    return ` <img class="gallery-img"onclick="onRenderEditor('${img.id}','${img.url}','create')" src="${img.url}" alt="Meme" />`
  })
  strHtml += imgs.join('')
  elGallery.innerHTML = strHtml
  renderKeyWords()
}

function toggleMenu() {
  document.body.classList.toggle('menu-open')
  document.querySelector('.main-nav').classList.toggle('mobile-nav')
}

function onImgInput(ev) {
  loadImageFromInput(ev, renderImg)
}

function loadImageFromInput(ev, onImageReady) {
  const reader = new FileReader()

  reader.onload = function (event) {
    const img = new Image()
    img.onload = () => {
      onImageReady(img)
    }
    img.src = event.target.result
  }
  reader.readAsDataURL(ev.target.files[0])
}

function renderImg(img) {
  const imgRatio = img.naturalWidth / img.naturalHeight
  renderCanvas(imgRatio)
  gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)

  onRenderEditor(generateRandomID(), img.src, 'upload')
}

function onFilterImgs(value) {
  const imgs = getImgs()
  filteredImgs = imgs.filter(img =>
    img.keywords.some(keyword =>
      keyword.toLowerCase().includes(value.toLowerCase())
    )
  )
  renderGallery()
}

function onSaveSearch(value) {
  saveSearch(value)
  renderGallery()
}

function renderKeyWords(amount = 5) {
  const keywords = getKeywordsSearch()
  const elSearchWords = document.querySelector('.search-words')
  let strHtml = []
  for (let i = 0; i < amount; i++) {
    if (!keywords[i]) continue
    strHtml.push(`<h3 class="word-${i}">${keywords[i][0]}</h3>`)
  }
  shuffleArray(strHtml)
  elSearchWords.innerHTML = strHtml.join(' ')

  const baseFont = 1
  const fontSizeAdd = 0.2
  for (let i = 0; i < amount; i++) {
    if (!keywords[i]) continue
    let elWord = document.querySelector(`.word-${i}`)
    console.log('elWord.style.fontSize:', elWord.style.fontSize)
    elWord.style.fontSize = `${baseFont + fontSizeAdd * keywords[i][1]}rem`
  }
}
