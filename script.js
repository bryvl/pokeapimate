// Goal for this project
// To display knowledge of API usage, vanilla Javascript and React, mobile aware design, Git version control, and
// data storage

// Tasks To-Do
// - Make button to randomly load a Pokemon from the Poke API
// - Display Pokemon name in its own header and sprite img on left in its own column
// - Create Git repo for this project and regularly save changes
// - Bring in pokemon details from API to display next to image
// - Add ability to select a pokemon and add it to the user's team, displayed through pokeball-styled div
//   - If a pokemon is selected the user should not be able to get it on their screen again
// - Clicking on a pokeball should display the pokemon info back on the main view, where the user can view info
// or deselect the pokemon
// - Implement grid or flexbox to ensure easy mobile readiness
// - Translate to React components once basic functionalities are complete
// Stretch Goals:
// - Allow user to save their team to a database
// - User Log-In
// Streeetchy Stretch: Rewrite back end in Ruby

var pokeNameDiv = document.getElementById('pokeName');
var pokeImgDiv = document.getElementById('pokeImgDiv');
var button = document.getElementById('pokeGet');
// nesting the function to be called inside an outer generic function
// makes it so that the onclick/fetch doesn't execute on page load
button.onclick = function() {
    var randPkmnNum = Math.floor(Math.random()* 807);
    fetchFn(randPkmnNum);
};

// Essentially with fetch (vs say Ajax), bc fetching the URL returns a pending promise
// you have to implement a second .then() to actually go through the returned data after 
// using response.json() to make get the data in json

function fetchFn (pkmnNum) {
    var img =  document.createElement('img');
    fetch('https://pokeapi.co/api/v2/pokemon/' + pkmnNum)
        .then(
            
            function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                    return;
                }
                response.json().then(function(data) {
                    console.log(data);
                    // this is where we're going to run the functions to display the data
                    // side note: console.log() does not like adding a string to the data apparently
                    // example on how to grab the pokemon's name in this api: console.log(data.names[8].name) = Butterfree;
                    pokeNameDiv.innerHTML = "";
                    var pokeName = data.species.name;
                    var nameNode = document.createTextNode(pokeName);
                    pokeNameDiv.appendChild(nameNode);
                    
                    // Sprite grab
                    img.src = data.sprites.front_default;
                    img.style.width = '300px';
                    img.style.height = '300px';
                    pokeImgDiv.appendChild(img);



                    // var pokeImg = ;
                });
            }
            
)}
