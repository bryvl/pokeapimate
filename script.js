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
$(function() {
// var myModal = new bootstrap.Modal(document.getElementById('encounterModal'));

let pokeIntroDiv = document.getElementById('pokeIntro');
let welcomeText = document.getElementsByClassName('welcome-text');
let pokeNameDiv = document.getElementById('pokeName');
let pokeImgDiv = document.getElementById('pokeImgDiv');
let pokeInfoDiv = document.getElementById('pokeInfoDiv');

var button = document.getElementById('pokeGet');

// pokeDetailsDiv.appendChild(pokeInfoDiv);
// nesting the function to be called inside an outer generic function
// makes it so that the onclick/fetch doesn't execute on page load
button.onclick = function() {
    $('.welcome-text').remove();
    var randPkmnNum = Math.floor(Math.random()* 807);
    // myModal.show();
    fetchFn(randPkmnNum);
};

// Essentially with fetch (vs say Ajax), bc fetching the URL returns a pending promise
// you have to implement a second .then() to actually go through the returned data after 
// using response.json() to make get the data in json

function fetchFn (pkmnNum) {
    $('.pokeNameDiv').remove();
    $('.pokeType').remove();
    $('.pokeImgDiv').remove();
    $('.pokeInfoDiv-flvr-text').remove();
    $('.pokeInfoDiv-stats').remove();

    // let encounterScreen = (pkmnNum) => {

    // };

    var img = document.createElement('img');
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
                    let pokeNameDiv = document.createElement("div");
                    pokeNameDiv.classList.add('pokeNameDiv', 'col-12');
                    $(pokeNameDiv).addClass('red-border');
                    pokeIntroDiv.appendChild(pokeNameDiv);

                    var pokeId = data.id;
                    var pokeName = data.species.name;
                    var pokeIdNode = document.createTextNode(" (#" + pokeId + ") ");
                    var nameNode = document.createTextNode(pokeName);
                    pokeNameDiv.appendChild(nameNode);
                    pokeNameDiv.appendChild(pokeIdNode);

                    // Type Grab
                    let pokeTypeDiv = document.createElement('div');
                    pokeTypeDiv.classList.add('pokeType', 'col-12')
                    pokeIntroDiv.appendChild(pokeTypeDiv);
                    
                    var pokeTypeH2 = document.createElement('h2');
                    var pokeTypeSpan = document.createElement('span');
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
                        pokeTypeDiv.appendChild(pokeTypeH2);
                    } else {
                        var pokeType = data.types[0].type.name;
                        var pokeTypeText = document.createTextNode(pokeType);
                        pokeTypeH2.appendChild(pokeTypeText);
                        pokeTypeDiv.appendChild(pokeTypeH2);
                    }
                    
                    // Sprite grab
                    let pokeImgDiv = document.createElement("div");
                    pokeImgDiv.classList.add('pokeImgDiv', 'col-4');
                    pokeIntroDiv.appendChild(pokeImgDiv);

                    
                    img.src = data.sprites.front_default;
                    img.style.width = '300px';
                    img.style.height = '300px';
                    pokeImgDiv.appendChild(img);


                    // Stat name and stat display
                    let pokeStatsDiv = document.createElement('div');
                    pokeStatsDiv.classList.add('pokeInfoDiv-stats', 'col-6')
                    pokeInfoDiv.appendChild(pokeStatsDiv);

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
                    pokeStatsDiv.appendChild(displayedStatList);

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

                                        let pokeFlavorText = document.createElement('div');
                                        pokeFlavorText.classList.add('pokeInfoDiv-flvr-text', 'col-6')
                                        pokeInfoDiv.appendChild(pokeFlavorText);

                                        var displayedFlavorText = document.createElement("div");
                                        var displayedFlavorTextNode = document.createTextNode(engFlavorText);
                                        displayedFlavorText.appendChild(displayedFlavorTextNode);
                                        pokeFlavorText.appendChild(displayedFlavorText);
                                        // Add stretch goal: Some flavor texts and names therein are formatted weirdly 
                                        // in the API and we should try to correct it for better appearance
                                        return;
                                    }
                                }
                            })
                        }
                    )
                    pokeInfoDiv.classList.add('col-8');
                    pokeIntroDiv.appendChild(pokeInfoDiv);
                });
            }
            
)}
});