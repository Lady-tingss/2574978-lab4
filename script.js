// Required: Use async/await OR .then() for API calls
// Required: Use try/catch OR .catch() for error handling

async function searchCountry(countryName) {
    const spinner=document.getElementById('loading-spinner');
    const countryInfo=document.getElementById('country-info');
    const bordersSection=document.getElementById('bordering-countries');
    const errorMessage=document.getElementById('error-message');

    spinner.classList.remove('hidden');
    errorMessage.textContent='';
    countryInfo.innerHTML='';
    bordersSection.innerHTML='';

    try {
        // Show loading spinner
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if(!response.ok){
            throw new Error('Country not found');
        }
        // Fetch country data
        const data=await response.json();
        const country=data[0];

        const name = country.name.common;
        const capital = country.capital ? country.capital[0] : 'N/A';
        const population = country.population;
        const region = country.region;
        const flag = country.flags.svg;
       

        // Update DOM
        document.getElementById('country-info').innerHTML = `
    <h2>${country.name.common}</h2>
    <p><strong>Capital:</strong> ${country.capital[0]}</p>
    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    <p><strong>Region:</strong> ${country.region}</p>
    <img src="${country.flags.svg}" alt="${country.name.common} flag">
`;
        // Fetch bordering countries
        const borders=country.borders;
        const bordersSection=document.getElementById('bordering-countries');
        borderSection.innerHTML='';

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
        // Show error message
        errorMessage.textContent = error.message;
    } finally {
        // Hide loading spinner
        spinner.classList.add('hidden');
    }
}

// Event listeners
document.getElementById('search-btn').addEventListener('click', () => {
    const country = document.getElementById('country-input').value;
    searchCountry(country);
});