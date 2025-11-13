'use strict'

function onRenderSavedMemes() {
  document.querySelector('.saved-memes').classList.remove('hidden')
  document.querySelector('.editor').classList.add('hidden')
  document.querySelector('.gallery').classList.add('hidden')
  document.querySelector('.about').classList.add('hidden')
  renderSavedMemes()
}

function renderSavedMemes() {
  const elSavedMemes = document.querySelector('.saved-memes')
  var savedMemes = loadFromStorage(MEME_KEY)
  if (!savedMemes) return
  let strHtml = ''

  savedMemes = savedMemes.map(meme => {
    return ` <div class="saved-meme-container relative">
    <img class="gallery-img" onclick="onRenderEditor('${meme.selectedImgId}','${meme.url}','edit')" src="${meme.data}" alt="Meme" />
    <button onclick="onRemoveMeme('${meme.selectedImgId}')" class="btn close-btn" >X</button>
    </div>`
  })
  strHtml += savedMemes.join('')
  elSavedMemes.innerHTML = strHtml
}

//on things
function onRemoveMeme(id) {
  removeMeme(id)
  renderSavedMemes()
}
