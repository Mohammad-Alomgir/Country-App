document.addEventListener("DOMContentLoaded", () => {
  const showCountryDetails = document.querySelector(".show-country-details");
  const loading = document.querySelector(".loading");
  const params = new URLSearchParams(window.location.search);
  const countryName = params.get("name");

  if (!countryName) {
    showCountryDetails.innerHTML = "<p>Country name not specified in URL.</p>";
    loading.classList.remove("active");
    showCountryDetails.classList.add("active");
    return;
  }

  async function getCountryByName() {
    try {
      let response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
      if (!response.ok) {
        throw new Error('Country not found');
      }
      let result = await response.json();
      return result;
    } catch (error) {
      throw new Error('Failed to fetch country data');
    }
  }

  async function getBorderCountryName(borderCode) {
    try {
      let response = await fetch(`https://restcountries.com/v3.1/alpha/${borderCode}`);
      if (!response.ok) {
        throw new Error('Border country not found');
      }
      let result = await response.json();
      console.log(result)
      return result[0].name.common;
    } catch (error) {
      console.log('Failed to fetch border country data', error);
      return 'Unknown';
    }
  }

  getCountryByName()
    .then(async (data) => {
      if (data.length === 0) {
        showCountryDetails.innerHTML = "<p>No country data found.</p>";
        loading.classList.remove("active");
        showCountryDetails.classList.add("active");
        return;
      }

      const infoCountry = data[0];

      const borders = infoCountry.borders || [];
      const borderCountryPromises = borders.map((border) =>  getBorderCountryName(border));
      const borderCountryNames = await Promise.all(borderCountryPromises);
      const nativeName = infoCountry.name.nativeName?.ara?.official || "N/A";
      const capital = infoCountry.capital?.map((cap) => `<span>${cap}</span>`).join(" ") || "N/A";
      const currencies = Object.values(infoCountry.currencies || {}).map((curr) => curr.name).join(", ") || "N/A";
      const languages = Object.values(infoCountry.languages || {}).join(", ") || "N/A";

      let borderCountriesLinks = borderCountryNames.map((name) => name && `<a href="details.html?name=${name}">${name}</a>`).join(" ");
      let detailsInfo = `
        <div class="flag">
          <img src="${infoCountry.flags.svg}" alt="Flag of ${infoCountry.name.common}">
        </div>
        <div class="country-body">
          <h1 class="title">${infoCountry.name.common}</h1>
          <div class="essential-country-info">
            <div class="info left-info">
              <ul>
                <li>Native Name : <span>${nativeName}</span></li>
                <li>Population : <span>${infoCountry.population}</span></li>
                <li>Region : <span>${infoCountry.region}</span></li>
                <li>Sub Region: <span>${infoCountry.subregion}</span></li>
                <li>Capital : ${capital}</li>
              </ul>
            </div>
            <div class="info right-info">
              <ul>
                <li>Top Level Domain: <span>${infoCountry.tld.join(", ")}</span></li>
                <li>Currencies: <span>${currencies}</span></li>
                <li>Languages: <span>${languages}</span></li>
              </ul>
            </div>
          </div>
          <div class="border-countries">
            <h2>Border Countries:</h2>
            <div class="border-countries-link">
              ${borderCountriesLinks}
            </div>
          </div>
        </div>
      `;

      showCountryDetails.innerHTML = detailsInfo;
      loading.classList.remove("active");
      showCountryDetails.classList.add("active");
    })
    .catch((err) => {
      loading.classList.remove("active");
      showCountryDetails.classList.add("active");
      console.log(err);
      showCountryDetails.innerHTML = `<p>${err.message}</p>`;
    });
});
