const apiBase = 'https://pokeapi.co/api/v2/pokemon';
let nextUrl = null;
let prevUrl = null;

async function getPokemon(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    nextUrl = data.next;
    prevUrl = data.previous;

    const pokemonList = data.results;
    const res = [];

    for (let i = 0; i < pokemonList.length; i++) {
      const detailResponse = await fetch(pokemonList[i].url);
      const details = await detailResponse.json();
      res.push({
        name: pokemonList[i].name,
        url: pokemonList[i].url,
        details: details,
        // details: {
        //   abilities: details.abilities.map((a) => a.ability.name),
        //   height: details.height,
        //   weight: details.weight,
        //   spesies: details.species.name,
        // 	stats: details.stats.map((s) => ({
        // 		name: s.stat.name,
        // 		value: s.base_stat
        // 	})),
        // 	types: details.types.map((t) => t.type.name),
        //   // },
      });
    }

    const container = document.getElementById('pokemon-container');
    container.innerHTML = '';

    res.forEach((pokemon, index) => {
      const pokemonCardHTML = `
        <div class="col-md-3 p-2">
          <div class="card pokemon-card" style="width: 100%;">
            <img src="${
              pokemon.details.sprites.front_default || ''
            }" class="card-img-top pokemon-image" alt="${pokemon.name}">
            <div class="card-body">
              <h3 class="card-title text-w font-weight-bold">${pokemon.name.toUpperCase()}</h3>
              <p class="card-text mb-0">
                <strong>Height:</strong> ${pokemon.details.height / 10} m<br>
                <strong>Weight:</strong> ${pokemon.details.weight / 10} kg<br>
                <strong>Spesies:</strong> ${capitalizeCase(
                  pokemon.details.species.name
                )}<br>
                <strong>Base Experience:</strong> ${
                  pokemon.details.base_experience
                }<br>
                <strong>Types:</strong> ${pokemon.details.types
                  .map((typeInfo) => capitalizeCase(typeInfo.type.name))
                  .join(', ')} <br>
                <strong>Abilities:</strong> ${pokemon.details.abilities
                  .map((abilityInfo) =>
                    capitalizeCase(abilityInfo.ability.name)
                  )
                  .join(', ')} <br>
                <span class="d-inline-flex align-items-center">
                  <strong>Stats:</strong>
                  <i class="fas fa-plus ml-2" data-toggle="collapse" data-target="#stats${index}" aria-expanded="false" aria-controls="stats${index}"></i>
                </span>
                <div class="collapse" id="stats${index}">
                  ${pokemon.details.stats
                    .map(
                      (statInfo) => `
                      <strong> - ${capitalizeCase(
                        statInfo.stat.name
                      )}:</strong> ${statInfo.base_stat}<br>
                    `
                    )
                    .join('')}
                </div>
              </p>
            </div>
          </div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', pokemonCardHTML);
    });
    updateNavigation();
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
  }
}

function updateNavigation() {
  const nextButton = document.getElementById('next-button');
  const prevButton = document.getElementById('prev-button');

  if (nextUrl) {
    nextButton.classList.remove('disabled');
    nextButton.onclick = () => getPokemon(nextUrl);
  } else {
    nextButton.classList.add('disabled');
    nextButton.onclick = null;
  }

  if (prevUrl) {
    prevButton.classList.remove('disabled');
    prevButton.onclick = () => getPokemon(prevUrl);
  } else {
    prevButton.classList.add('disabled');
    prevButton.onclick = null;
  }
}

window.onload = () => getPokemon(apiBase);

// getPokemon();

function capitalizeCase(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
