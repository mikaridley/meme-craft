'use strict'

function onRenderAbout() {
  document.querySelector('.about').classList.remove('hidden')
  document.querySelector('.gallery').classList.add('hidden')
  document.querySelector('.editor').classList.add('hidden')
  document.querySelector('.saved-memes').classList.add('hidden')
  document.querySelector('.gallery-search-container').classList.add('hidden')

  if (document.body.classList.contains('menu-open')) toggleMenu()
}
//
