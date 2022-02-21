"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];
let displayedAnimals = [];
let currentSorting = {
    attribute: "",
    order: "",
};

// The prototype for all animals:
const Animal = {
    name: "",
    desc: "-unknown animal-",
    type: "",
    age: 0,
};

function start() {
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
    prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
    allAnimals = jsonData.map(prepareObject);
    // when we start the application we show all animals
    displayedAnimals = allAnimals;

    displayList(displayedAnimals);
}

function prepareObject(jsonObject) {
    const animal = Object.create(Animal);

    const texts = jsonObject.fullname.split(" ");
    animal.name = texts[0];
    animal.desc = texts[2];
    animal.type = texts[3];
    animal.age = jsonObject.age;

    return animal;
}

function onlyDogBtnClicked(event) {
    displayFiltered(allAnimals, onlyDogsFilter);
}

function onlyCatBtnClicked(event) {
    displayFiltered(allAnimals, onlyCatsFilter);
}

function allAnimalsBtnClicked(event) {
    displayedAnimals = allAnimals;
    sortAnimalsArray(currentSorting.attribute, currentSorting.order, displayedAnimals);
    displayList(allAnimals);
}

function animalSortingClicked(event) {
    const attribute = event.target.getAttribute("data-sort");

    let sortingResult = changeAnimalSorting(attribute);

    setSortingStyle(event.target, sortingResult.sortOrder);
    event.target.setAttribute("data-sort-direction", sortingResult.sortOrder);
}

function setSortingStyle(currentSortingElement, sortOrder) {
    let tableHeaders = document.querySelectorAll("#sorting>th");
    for (let i = 0; i < tableHeaders.length; i++) {
        tableHeaders[i].classList.remove("sortby");
        tableHeaders[i].textContent = tableHeaders[i].textContent.replace("↑", "").replace("↓", "");
    }

    currentSortingElement.classList.add("sortby");
    if (sortOrder === "asc") {
        currentSortingElement.textContent += "↑";
    } else {
        currentSortingElement.textContent += "↓";
    }
}

function changeAnimalSorting(newAttribute) {
    if (currentSorting.attribute === newAttribute) {
        currentSorting.order = changeSortOrder(currentSorting.order);
    } else {
        currentSorting.attribute = newAttribute;
        currentSorting.order = "asc";
    }

    let sortedArray = sortAnimalsArray(currentSorting.attribute, currentSorting.order, displayedAnimals);
    displayList(sortedArray);
    displayedAnimals = sortedArray;

    return { attribute: currentSorting.attribute, sortOrder: currentSorting.order, sortedArray };
}

function sortAnimalsArray(attribute, sortOrder, animals) {
    let compareFunc;
    switch (attribute) {
        case "name":
            compareFunc = nameComparator;
            break;
        case "type":
            compareFunc = typeComparator;
            break;
        case "desc":
            compareFunc = descriptionComparator;
            break;
        case "age":
            compareFunc = ageComparator;
            break;
    }

    if (sortOrder === "desc") {
        animals.sort((animalA, animalB) => {
            return descendingModifier(compareFunc(animalA, animalB));
        });
    } else {
        animals.sort(compareFunc);
    }
    return animals;
}

function changeSortOrder(currentOrder) {
    if (currentOrder === "asc") {
        return "desc";
    } else {
        return "asc";
    }
}

function displayFiltered(base, filter) {
    displayedAnimals = base.filter(filter);
    sortAnimalsArray(currentSorting.attribute, currentSorting.order, displayedAnimals);
    displayList(displayedAnimals);
}

function displayList(animals) {
    // clear the list
    document.querySelector("#list tbody").innerHTML = "";

    // build a new list
    animals.forEach(displayAnimal);
}

function displayAnimal(animal) {
    // create clone
    const clone = document.querySelector("template#animal").content.cloneNode(true);

    // set clone data
    clone.querySelector("[data-field=name]").textContent = animal.name;
    clone.querySelector("[data-field=desc]").textContent = animal.desc;
    clone.querySelector("[data-field=type]").textContent = animal.type;
    clone.querySelector("[data-field=age]").textContent = animal.age;

    // append clone to list
    document.querySelector("#list tbody").appendChild(clone);
}

function onlyDogsFilter(animal) {
    return animal.type.toUpperCase() === "DOG";
}

function onlyCatsFilter(animal) {
    return animal.type.toUpperCase() === "CAT";
}

function descendingModifier(previousResult) {
    return previousResult * -1;
}

function nameComparator(firstAnimal, secondAnimal) {
    return firstAnimal.name.localeCompare(secondAnimal.name);
}

function typeComparator(firstAnimal, secondAnimal) {
    return firstAnimal.type.localeCompare(secondAnimal.type);
}

function descriptionComparator(firstAnimal, secondAnimal) {
    return firstAnimal.desc.localeCompare(secondAnimal.desc);
}

function ageComparator(firstAnimal, secondAnimal) {
    return firstAnimal.age - secondAnimal.age;
}
