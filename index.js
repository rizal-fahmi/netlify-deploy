const api = 'https://pokeapi.co/api/v2/pokemon';

async function getPokemon() {
  try {
    const pokemon = await fetch(api);
    const data = await pokemon.json();
    console.log(data);

    const pokemonList = data.results;
    const res = [];

    for (const pokemon of pokemonList) {
      const detailPokemon = await fetch(pokemon.url);
      const details = await detailPokemon.json();
      res.push({
        name: pokemon.name,
        url: pokemon.url,
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

    res.forEach((element) => {
      console.log(element.name);
    });

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
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
  }
}

window.onload = getPokemon;

getPokemon();

function capitalizeCase(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
