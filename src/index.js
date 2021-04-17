const addBtn = document.querySelector('#new-toy-btn')
const toyForm= document.querySelector('.container')

let addToy = false; 
const allToysUrl = "http://localhost:3000/toys";

document.addEventListener("DOMContentLoaded", () => { 

  const toyCollection = document.querySelector("#toy-collection");

  // make a GET Request to fetch all Toys
   fetch(allToysUrl)
   .then(res => res.json())
   .then(toys => {
     let toyHTML = toys.map(toy => {
       return `
         <div class="card">
          <h2>${toy.name}</h2>
          <img src=${toy.image} class="toy-avatar" />
          <p>${toy.likes} </p>
          <button data-id=${toy.id} class="like-btn">Like <3</button>
          <button data-id=${toy.id} class="delete-btn">delete</button>
        </div>
       `;
     })
     
     toyCollection.innerHTML = toyHTML.join("");
   }) 

   toyForm.addEventListener('submit', (e) => {
     e.preventDefault()
     //Get inputs from the form
     const toyName = e.target.name.value
     const toyImage = e.target.image.value 
     

     //Do a post to our server using fetch 
     const data = {
       name: toyName,
       image: toyImage,
       likes: 0
     }
     const configObj = {
       method: "POST",
       headers: {
         "Content-Type":"application/json",
         "Accept":"application/json"
       },
       body: JSON.stringify(data)
     }
     fetch(allToysUrl, configObj)
     .then(res => res.json())
     .then(newToy => {
       //fetch newToy from DB
       //Convert the newToy from a json object to HTML in order to add to the DOM
       //update the DOM
       let newToyHTML = `
          <div class="card">
            <h2>${newToy.name}</h2>
            <img src=${newToy.image} class="toy-avatar" />
            <p>${newToy.likes} </p>
            <button data-id=${newToy.id} class="like-btn">Like <3</button>
            
          </div>
       
        `;
        
       toyCollection.innerHTML += newToyHTML;

      e.target.reset()
     })
     .catch(error => console.log(error.message) )
    
   })

   toyCollection.addEventListener("click", (e) => {
     
     if(e.target.className === "like-btn"){
        console.log(e.target.previousElementSibling.innerText);
        let likes = parseInt(e.target.previousElementSibling.innerText);
        console.log(likes) 
        let newLikes = likes + 1
        e.target.previousElementSibling.innerText = newLikes + ' likes'

        fetch(`http://localhost:3000/toys/${e.target.dataset.id}`,{
          method: "PATCH",
          headers: {
            "Content-Type":"application/json",
            "Accept":"application/json"
          },
          body: JSON.stringify({
            likes: newLikes
          })
        })
        
     }

     if (e.target.className === "delete-btn") {
       fetch(`http://localhost:3000/toys/${e.target.dataset.id}`,{
          method: "DELETE"
        })
        .then(res => {
          e.target.parentElement.remove()
        })
     }
   })

  // const addBtn = document.querySelector("#new-toy-btn");
  // const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyForm.style.display = "block";
    } else {
      toyForm.style.display = "none";
    }
  });
});

