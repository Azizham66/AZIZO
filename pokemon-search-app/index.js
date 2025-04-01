const searchForm = document.getElementById("pokemon-form");
const searchInput = document.getElementById("search-field");
const searchBtn = document.getElementById("search-btn");
const pokemonName = document.getElementById("pokemon-name");
const pokemonID = document.getElementById("pokemon-id");
const weightEl = document.getElementById("weight");
const heightEl = document.getElementById("height");
const spriteContainer = document.getElementById("image-container");
const typesContainer = document.getElementById("categories");
const hp = document.getElementById("hp");
const attack = document.getElementById("attack");
const defense = document.getElementById("defense");
const specialAttack = document.getElementById("special-attack");
const specialDefense = document.getElementById("special-defense");
const speed = document.getElementById("speed");4

const fetchData = async () => {
    try {
        const nameOrID = searchInput.value.trim().toLowerCase();
        const res = await fetch(
            `https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${nameOrID}`
        );
        const data = await res.json();
        showResult(data);
    } catch (err) {
        resetCard()
        alert('Pokémon not found')
        console.error(`Pokémon not found: ${err}`);
    }
}


const showResult = data => {
    const {name, id, weight, height, sprites, stats, types} = data;
    pokemonName.textContent = name.toUpperCase();
    pokemonID.textContent = `#${id}`;
    weightEl.textContent = `Weight: ${weight}`;
    heightEl.textContent = `Height: ${height}`;
    spriteContainer.innerHTML = `<img id="sprite" src="${sprites.front_default}" alt="${name}'s front default sprite">`;
    typesContainer.innerHTML = types
        .map(obj => {
        const {type} = obj;
        return `<span class="type ${type.name}">${type.name}</span>`
    })
        .join('')
    hp.textContent = stats[0].base_stat
    attack.textContent = stats[1].base_stat
    defense.textContent = stats[2].base_stat
    specialAttack.textContent = stats[3].base_stat
    specialDefense.textContent = stats[4].base_stat
    speed.textContent = stats[5].base_stat
}

const resetCard = () => {
    const sprite = document.getElementById("sprite");
    if (sprite) sprite.remove();

    pokemonName.textContent = "";
    pokemonID.textContent = "";
    weightEl.textContent = "";
    heightEl.textContent = "";
    hp.textContent = "";
    attack.textContent = "";
    defense.textContent = "";
    specialAttack.textContent = "";
    specialDefense.textContent = "";
    speed.textContent = "";
    searchInput.value = "";
    typesContainer.innerHTML = "";
}

searchBtn.addEventListener("click", e => {
    e.preventDefault();
    fetchData();
    searchInput.value = "";
});

searchForm.addEventListener("submit", e => {
    e.preventDefault();
    fetchData();
    searchInput.value = "";
})
