'use strict'

let currentLang = 'en'
const translations = {}

async function onLoadLanguage(lang) {
  renderI18nBtns()
  const res = await fetch(`./i18n/${lang}.json`)
  translations[lang] = await res.json()
  currentLang = lang
  translatePage()
}

function translatePage() {
  const elements = document.querySelectorAll('[data-i18n]')

  elements.forEach(el => {
    const key = el.dataset.i18n
    el.textContent = translations[currentLang][key]
  })
}

function renderI18nBtns() {
  const elEn = document.querySelector('.i18n-en-btn')
  const elHe = document.querySelector('.i18n-he-btn')
  if (elEn.classList.contains('hidden')) {
    elEn.classList.remove('hidden')
    elHe.classList.add('hidden')
  } else {
    elEn.classList.add('hidden')
    elHe.classList.remove('hidden')
  }

  if (document.body.classList.contains('menu-open')) toggleMenu()
}
