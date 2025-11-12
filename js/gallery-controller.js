'use strict'

function onRenderGallery() {
  document.querySelector('.gallery').classList.remove('hidden')
  document.querySelector('.editor').classList.add('hidden')
  renderGallery()
}

function renderGallery() {
  const elGallery = document.querySelector('.gallery')
  var imgs = getImgs()
  console.log('imgs:', imgs)
  let strHtml = ''

  imgs = imgs.map(img => {
    return ` <img onclick="onRenderEditor('${img.id}')" src="${img.url}" alt="Meme" />`
  })
  strHtml = imgs.join('')
  elGallery.innerHTML = strHtml
}
