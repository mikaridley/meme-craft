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
  let strHtml = '<div class="upload-img">Upload</div>'

  imgs = imgs.map(img => {
    return ` <img class="gallery-img"onclick="onRenderEditor('${img.id}','${img.url}','create')" src="${img.url}" alt="Meme" />`
  })
  strHtml += imgs.join('')
  elGallery.innerHTML = strHtml
}

function toggleMenu() {
  document.querySelector('.main-nav').classList.toggle('mobile-nav')
}
