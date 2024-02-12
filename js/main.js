const API_KEYS = {
    Movie: '1888c41a',
    Websocket: '0d87814fbb4cc50baf748af1d2e89aa7'
}
const BASE_URLS = {
    MovieFinderUrl: `https://www.omdbapi.com/?apikey=${API_KEYS.Movie}&`,
    ChatSocketUrl: `wss://socketsbay.com/wss/v2/1/${API_KEYS.Websocket}/`
}
const results = document.querySelector('.search-results')

const timeDelay = 40
let isStarting = false
let timer
let counter = 0

let websocket = new WebSocket(BASE_URLS.ChatSocketUrl);
let log = results.querySelector('.recently')

const searchForm = document.forms.searchMovieForm
searchForm.addEventListener('submit', function (e) {
    e.preventDefault()
    let query = e.target.elements.query
    if(query.value.length < 3) {
        query.classList.add('--error')
        return
    }
    query.classList.remove('--error')

    searchMovie(query.value)

    websocket.send(query.value)
    log.innerHTML += createMessage(query.value)

    e.target.reset()
})

async function searchMovie (query) {
    let res = await fetch(`${BASE_URLS.MovieFinderUrl}s=${query}`)
    let data = await res.json()
    results.querySelector('.query').innerHTML = query
    data.Search.forEach(item => {
        results.appendChild(renderSearchItem(item))
    });
}

function renderSearchItem(item) {
    let wrap = document.createElement('article')
    wrap.classList.add('search-results__item')

    let poster = document.createElement('picture')
    poster.classList.add('search-results__poster')
    poster.innerHTML = `<img src="${item.Poster}" alt="${item.Title}">`
    wrap.appendChild(poster)

    let title = document.createElement('h2')
    title.classList.add('search-results__title')
    title.innerText = item.Title
    wrap.appendChild(title)

    let about = document.createElement('p')
    about.classList.add('search-results__about')
    about.innerHTML += `<span class="search-results__year">${item.Year} </span>`
    about.innerHTML += `<span class="search-results__type">${item.Type}</span>`
    wrap.appendChild(about)

    let link = document.createElement('a')
    link.setAttribute('href', `single.html?i=${item.imdbID}`)
    link.innerHTML = `About <span class="material-symbols-outlined">arrow_forward_ios</span>`
    wrap.appendChild(link)

    return wrap
}
//

function createMessage (msg) {
    return `<h4>Recently searched: ${msg}</h4>`
}
websocket.onmessage = function(event) {
    log.innerHTML += createMessage(event.data)
};
websocket.onopen = function(event) {
    
}

function chatPage() {
    window.location.href = 'https://7mechka.github.io/Websocket-Chat/'
    console.log('chat')
}

//
function debounce(delay, query) {
    if (isStarting && timer) {
        updateTimer(delay, query)
    }
    if (!isStarting) {
        isStarting = true
        timer = setInterval(() => {timeCheck(delay, query)}, 10)
    }
}
function updateTimer(delay, query) {
    clearInterval(timer)
    counter = 0
    timer = setInterval(() => {timeCheck(delay, query)}, 10)
}
function timeCheck(delay, query) {
    counter++
    if (counter >= delay) {
        counter = 0
        clearInterval(timer)
        isStarting = false

        console.log(query)
    }
}