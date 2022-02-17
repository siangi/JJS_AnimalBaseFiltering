"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];
let displayedAnimals =[];

// The prototype for all animals: 
const Animal = {
    name: "",
    desc: "-unknown animal-",
    type: "",
    age: 0
};

function start( ) {
    console.log("ready");

    document.querySelector("button[data-filter='cat']").onclick = onlyCatBtnClicked;
    document.querySelector("button[data-filter='dog']").onclick = onlyDogBtnClicked;
    document.querySelector("button[data-filter='*']").onclick = allAnimalsBtnClicked; 

    loadJSON();
}


async function loadJSON() {
    const response = await fetch("animals.json");
    const jsonData = await response.json();
    
    // when loaded, prepare data objects
    prepareObjects( jsonData );
}

function prepareObjects( jsonData ) {
    allAnimals = jsonData.map( preapareObject );
    // when we start the application we show all animals
    displayedAnimals = allAnimals;
    
    displayList(displayedAnimals);
}

function preapareObject( jsonObject ) {
    const animal = Object.create(Animal);
    
    const texts = jsonObject.fullname.split(" ");
    animal.name = texts[0];
    animal.desc = texts[2];
    animal.type = texts[3];
    animal.age = jsonObject.age;

    return animal;
}

function onlyDogBtnClicked(event){
    displayFiltered(allAnimals, onlyDogsFilter);
}

function onlyCatBtnClicked(event){
    displayFiltered(allAnimals, onlyCatsFilter);
}

function allAnimalsBtnClicked(event){
    displayList(allAnimals);
}

function displayFiltered(base, filter){
    displayedAnimals = base.filter(filter);
    displayList(displayedAnimals)
}

function displayList(animals) {
    // clear the list
    document.querySelector("#list tbody").innerHTML = "";

    // build a new list
    animals.forEach( displayAnimal );
}

function displayAnimal( animal ) {
    // create clone
    const clone = document.querySelector("template#animal").content.cloneNode(true);

    // set clone data
    clone.querySelector("[data-field=name]").textContent = animal.name;
    clone.querySelector("[data-field=desc]").textContent = animal.desc;
    clone.querySelector("[data-field=type]").textContent = animal.type;
    clone.querySelector("[data-field=age]").textContent = animal.age;

    // append clone to list
    document.querySelector("#list tbody").appendChild( clone );
}

function onlyDogsFilter(animal){
    return (animal.type.toUpperCase() === "DOG");
}

function onlyCatsFilter(animal){
    return (animal.type.toUpperCase() === "CAT");
}


