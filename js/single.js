const API_KEY = '1888c41a'
const BASE_URL = `http://www.omdbapi.com/?apikey=${API_KEY}&`

const searchParams = new URLSearchParams(window.location.search)

if(searchParams.has('i') && (searchParams.get('i') != '')) {
    let movieInfo = getMovie(searchParams.get('i'))
    movieInfo.then(data => {
        document.querySelector('.single__poster img').setAttribute('src', data.Poster)
        document.querySelector('.single__poster img').setAttribute('alt', data.Title)

        document.querySelector('.single__title').innerText = data.Title
        document.querySelector('.single__year').innerText = data.Type
        document.querySelector('.single__type').innerText = data.Year
        document.querySelector('.single__plot').innerText = data.Plot
    })
}
else {
    redirectToHome('Movie not found')
}

async function getMovie(query) {
    let res = await fetch(`${BASE_URL}i=${query}`)
    let data = await res.json()
    return data
}

function redirectToHome(msg) {
    alert(msg)
    window.location.replace('index.html')
}