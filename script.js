// Required: Use async/await OR .then() for API calls
// Required: Use try/catch OR .catch() for error handling

async function searchCountry(countryName) {
    const spinner = document.getElementById('loading-spinner');
    const countryInfo = document.getElementById('country-info');
    const bordersSection = document.getElementById('bordering-countries'); // declare once
    const errorMessage = document.getElementById('error-message');

    spinner.classList.remove('hidden');
    errorMessage.textContent = '';
    countryInfo.innerHTML = '';
    bordersSection.innerHTML = '';

    try {
        // Fetch main country
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) throw new Error('Country not found');

        const data = await response.json();
        const country = data[0];

        const name = country.name.common;
        const capital = country.capital ? country.capital[0] : 'N/A';
        const population = country.population;
        const region = country.region;
        const flag = country.flags.svg;

        // Update main country info
        countryInfo.innerHTML = `
            <h2>${name}</h2>
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Population:</strong> ${population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${region}</p>
            <img src="${flag}" alt="${name} flag">
        `;

        // Fetch and display bordering countries
        const borders = country.borders;
        if (borders && borders.length > 0) {
            for (const code of borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResponse.json();
                const neighbor = borderData[0];

                bordersSection.innerHTML += `
                    <div class="border-country">
                        <h4>${neighbor.name.common}</h4>
                        <img src="${neighbor.flags.svg}" alt="${neighbor.name.common} flag" width="100">
                    </div>
                `;
            }
        }

    } catch (error) {
        errorMessage.textContent = error.message;
    } finally {
        spinner.classList.add('hidden');
    }
}

// Event listeners
document.getElementById('search-btn').addEventListener('click', () => {
    const country = document.getElementById('country-input').value;
    searchCountry(country);
});