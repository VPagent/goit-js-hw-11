
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



let page = 1

function onFormSubmit(event){
    event.preventDefault()
    btnLoad.classList.add("disabled")
    gallery.innerHTML = ""
    let inputValue = form[0].value.trim("")
    // console.log(inputValue)
    page = 1

    fetchPhoto().then(array => {
        
        
        const markup = mark(array)
        gallery.insertAdjacentHTML("beforeend", markup)
        
        if(array.length !== 40){

            btnLoad.classList.add("disabled")
            return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        }
        Notiflix.Notify.success("Hooray! We found 500 images")
    })
    form.reset()
    btnLoad.classList.remove("disabled")
    
    
}


async function onBtnClick(){
    //  if(page === 13){
    //     btnLoad.classList.add("disabled")
    //     Notiflix.Notify.info("Its all photos")
    //     return
    // }
    page += 1
    fetchPhoto(page).then(array => {
        const markup = mark(array)
        gallery.insertAdjacentHTML("beforeend", markup)
    })
    
}

async function fetchPhoto(page = 1){
    try{
        const options = await new URLSearchParams({
            per_page: 40,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: "true",
        });
        let BASE_URL = await `https://pixabay.com/api/?key=29321758-e768d1c89c32410537fe23d2a&q=${inputValue}&page=${page}&${options}`
        const response = await axios.get(BASE_URL, options)
        const photos = await response.data.hits
        console.log(response)
        console.log(photos) 
        return photos
        
    } catch {return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")}
   

}

function mark (arr){
     return arr.reduce((acc, elem) => {
            
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
}





