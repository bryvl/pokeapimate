// Goal for this project
// To display knowledge of API usage, vanilla Javascript and React, mobile aware design, Git version control, and
// data storage

// Tasks To-Do
// - Make button to randomly load a Pokemon from the Poke API (done)
// - Display Pokemon name in its own header and sprite img on left in its own column (done)
// - Create Git repo for this project and regularly save changes (done)
// - Bring in pokemon details from API to display next to image (done)
// - Implement grid or flexbox to ensure easy mobile readiness
// - Add ability to select a pokemon and add it to the user's team, displayed through pokeball-styled div
//   - If a pokemon is selected the user should not be able to get it on their screen again
// - Clicking on a pokeball should display the pokemon info back on the main view, where the user can view info
// or deselect the pokemon
// - Translate to React components once basic functionalities are complete

// Stretch Goals:
// - Allow user to save their team to a database
// - User Log-In
// - Some flavor texts and names therein are formatted weirdly in the API and we should try to
// correct it for better appearance

// Streeetchy Stretch: Rewrite back end in Ruby

var pokeNameDiv = document.getElementById('pokeName');
var pokeImgDiv = document.getElementById('pokeImgDiv');
var pokeInfoDiv = document.getElementById('pokeInfoDiv');
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
                    console.log('Looks like there was a problem fetching the Pokemon data. Status Code: ' +
                    response.status);
                    return;
                }
                response.json().then(function(data) {
                    console.log(data);

                    var pokeSpeciesUrl = data.species.url;
                    // this is where we're going to run the functions to display the data
                    // side note: console.log() does not like adding a string to the data apparently
                    // example on how to grab the pokemon's name in this api: console.log(data.names[8].name) = Butterfree;
                    
                    // Grab Pokemon name and ID
                    pokeNameDiv.innerHTML = "";
                    var pokeId = data.id;
                    var pokeName = data.species.name;
                    var pokeIdNode = document.createTextNode(" (#" + pokeId + ") ");
                    var nameNode = document.createTextNode(pokeName);
                    pokeNameDiv.appendChild(nameNode);
                    pokeNameDiv.appendChild(pokeIdNode);
                    
                    // Sprite grab
                    pokeImgDiv.innerHTML = '';
                    img.src = data.sprites.front_default;
                    img.style.width = '300px';
                    img.style.height = '300px';
                    pokeImgDiv.appendChild(img);

                    // Type Grab
                    pokeInfoDiv.innerHTML = '';
                    var pokeTypeH2 = document.createElement('h2');
                    var pokeTypeSpan = document.createElement('span');
                    // pokeTypeH2.appendChild(pokeTypeSpan);
                    if (data.types.length > 1) {
                        for (i = 0; i < data.types.length; i++) {
                            var pokeType = data.types[i].type.name;
                            var pokeTypeText = document.createTextNode(pokeType);
                            if (i < data.types.length && i > 0) {
                                var separatorSpan = document.createElement('span');
                                var separator = document.createTextNode(' / ');
                                separatorSpan.appendChild(separator);
                                pokeTypeSpan.appendChild(separatorSpan);
                            }
                            pokeTypeSpan.appendChild(pokeTypeText);
                        }
                        pokeTypeH2.appendChild(pokeTypeSpan);
                        pokeInfoDiv.appendChild(pokeTypeH2);
                    } else {
                        var pokeType = data.types[0].type.name;
                        var pokeTypeText = document.createTextNode(pokeType);
                        pokeTypeH2.appendChild(pokeTypeText);
                        pokeInfoDiv.appendChild(pokeTypeH2);
                    }


                    // Stat name and stat display
                    var displayedStatList = document.createElement('ul');
                    displayedStatList.className += " statBox";
                    displayedStatList.style.listStyleType = 'none';
                    displayedStatList.style.textAlign = 'left';
                    for (i = 0; i < data.stats.length; i++) {
                        var statName = data.stats[i].stat.name;
                        var stat = data.stats[i].base_stat;
                        
                        var displayedStat = document.createElement('li');
                        
                        var displayedStatNameNode = document.createTextNode(statName + ": ");
                        var displayedStatNode = document.createTextNode(stat);
                        
                        displayedStat.appendChild(displayedStatNameNode);
                        displayedStat.appendChild(displayedStatNode);
                        displayedStatList.appendChild(displayedStat);
                    }
                    pokeInfoDiv.appendChild(displayedStatList);

                    // This fetch is grabbing the pokemon species id from the previous data so we can look for
                    // the right flavor text to display. We then have to iterate through the array of texts
                    // to find the English ones and we'll return the first English one we get.
                    // Ay we got it in one shot! Noice.
                    fetch(pokeSpeciesUrl).then(
                        function(response) {
                            if (response.status !== 200) {
                                console.log('Looks like there was a problem fetching the species Url. Status Code: ' +
                                response.status);
                                return;
                            }
                            response.json().then(function(data) {
                                console.log("Flavor Text: ");
                                console.log(data.flavor_text_entries);
                                for (i = 0; i < data.flavor_text_entries.length; i++) {
                                    if (data.flavor_text_entries[i].language.name == "en") {
                                        var engFlavorText = data.flavor_text_entries[i].flavor_text;
                                        // Now we've gotta display the flavor text adjacent to the UL
                                        // and that should be it for the intro box.
                                        console.log(engFlavorText);
                                        var displayedFlavorText = document.createElement("div");
                                        var displayedFlavorTextNode = document.createTextNode(engFlavorText);
                                        displayedFlavorText.appendChild(displayedFlavorTextNode);
                                        displayedFlavorText.className += " flavorBox";
                                        pokeInfoDiv.appendChild(displayedFlavorText);
                                        // Add stretch goal: Some flavor texts and names therein are formatted weirdly 
                                        // in the API and we should try to correct it for better appearance
                                        return;
                                    }
                                }
                            })
                        }
                    )
                    
                });
            }
            
)}
