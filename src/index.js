
import "./sass/index.scss"
import Notiflix from 'notiflix';
const axios = require('axios');
const form = document.querySelector(".search-form")
const gallery = document.querySelector(".gallery")
const btnLoad = document.querySelector(".load-more") 
const lastEl = gallery.lastElementChild


btnLoad.classList.add("disabled")

form.addEventListener("submit", onFormSubmit)
btnLoad.addEventListener("click", onBtnClick)


let inputValue = ""
let page = 1
let totalHits
let currentHits = 0

function onFormSubmit(event){
    event.preventDefault()
    btnLoad.classList.add("disabled")
    gallery.innerHTML = ""
    inputValue = form[0].value.trim("")
    page = 1
    currentHits = 0
   
    fetchPhoto().then(array => {
        if(inputValue === "" || array.hits.length === 0){
            btnLoad.classList.add("disabled")
            return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        }
        const markup = mark(array.hits)
        gallery.insertAdjacentHTML("beforeend", markup)
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images`)
        if(currentHits < 40){
            btnLoad.classList.add("disabled")
            return
        }
    })
    form.reset()
    btnLoad.classList.remove("disabled")
    
}


function onBtnClick(){
    
    page += 1
    if(currentHits >= totalHits){
        btnLoad.classList.add("disabled")
        return Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
    }
    fetchPhoto(page).then(array => {
        const markup = mark(array.hits)
        gallery.insertAdjacentHTML("beforeend", markup)
        console.log(array)
        if(array.totalHits <= (page * 40)){
         btnLoad.classList.add("disabled")
        return Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
        }
    })  
}

async function fetchPhoto(page = 1){

    try{
        const options = new URLSearchParams({
            per_page: 40,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: "true",
        });
        let BASE_URL = `https://pixabay.com/api/?key=29321758-e768d1c89c32410537fe23d2a&q=${inputValue}&page=${page}&${options}`
        const response = await axios.get(BASE_URL, options)
        const photos = await response.data
        totalHits = await response.data.totalHits 
        return photos      
    } catch {error}
   

}

function mark (arr){
    console.log(arr)
    currentHits += arr.length
    console.log(currentHits)
    console.log(totalHits)
    const mar = arr.reduce((acc, elem) => {
            
       acc += `
        <div class="photo-card" width="400px">
        
           <img src="${elem.webformatURL}" alt="${elem.tags}" loading="lazy" />
           
           <div class="info">
             <p class="info-item">
               <b>Likes</b>
               ${elem.likes}
             </p>
             <p class="info-item">
               <b>Views</b>
               ${elem.views}
             </p>
             <p class="info-item">
               <b>Comments</b>
               ${elem.comments}
             </p>
             <p class="info-item">
               <b>Downloads</b>
               ${elem.downloads}
             </p>
           </div>
        </div>`
        return acc
    }, "")
    return mar
}





