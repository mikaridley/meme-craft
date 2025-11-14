'use strict'

function onInit() {
  renderGallery()
}

function onRenderGallery() {
  document.querySelector('.gallery').classList.remove('hidden')
  document.querySelector('.editor').classList.add('hidden')
  document.querySelector('.saved-memes').classList.add('hidden')
  document.querySelector('.about').classList.add('hidden')

  renderGallery()
}

function renderGallery() {
  const elGallery = document.querySelector('.gallery')
  var imgs = getImgs()
  let strHtml = ''
  imgs = imgs.map(img => {
    return ` <img class="gallery-img"onclick="onRenderEditor('${img.id}','${img.url}','create')" src="${img.url}" alt="Meme" />`
  })
  strHtml += imgs.join('')
  elGallery.innerHTML += strHtml
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
