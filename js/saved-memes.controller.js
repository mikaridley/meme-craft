'use strict'

function onRenderSavedMemes() {
  document.querySelector('.saved-memes').classList.remove('hidden')
  document.querySelector('.editor').classList.add('hidden')
  document.querySelector('.gallery').classList.add('hidden')
  document.querySelector('.about').classList.add('hidden')
  document.querySelector('.gallery-search-container').classList.add('hidden')

  if (document.body.classList.contains('menu-open')) toggleMenu()

  renderSavedMemes()
}

function renderSavedMemes() {
  const elSavedMemes = document.querySelector('.saved-memes')
  let savedMemes = loadFromStorage(MEME_KEY) || []
  let strHtml = ''
  if (!savedMemes) return
  if (savedMemes.length === 0) {
    strHtml = ` <div data-i18n="no-meme-msg" class="no-meme-container" >You currently haven’t saved any memes.</div>`
  } else {
    savedMemes = savedMemes.map(meme => {
      return ` <div class="saved-meme-container relative">
    <img class="gallery-img" onclick="onRenderEditor('${meme.selectedImgId}','${meme.url}','edit')" src="${meme.data}" alt="Meme" />
    <button onclick="onRemoveMeme('${meme.selectedImgId}')" class="btn close-btn" >X</button>
    </div>`
    })
  }
  strHtml += savedMemes.join('')
  elSavedMemes.innerHTML = strHtml
  translatePage()
}

//on things
function onRemoveMeme(id) {
  removeMeme(id)
  renderSavedMemes()
}
