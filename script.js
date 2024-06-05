const countriesInfoList = document.querySelector(".countries-info-list");
const regionListUl = document.querySelector(".region-list");
const regionDropDown = document.querySelector(".region-dropdown");
const regionQueryParams = new URLSearchParams(window.location.search);
const regionQuery = regionQueryParams.get("region");
const inputField = document.querySelector(".serach-input-field");
let searchQuery = [];
const themeChanger = document.querySelector(".theme-changer");

document.addEventListener("DOMContentLoaded", function () {
  // Region dropdown
  regionDropDown.addEventListener("click", function () {
    regionListUl.classList.toggle("dropdown");
  });
  console.log(document.body)
  const themeChanger = document.querySelector(".theme-changer");
  console.log(document.body);
  document.body.classList.add(localStorage.getItem("theme").toString());
  document.querySelector(".theme-changer").innerText = localStorage.getItem("theme-text");
  console.log(localStorage.getItem('theme-text'))
  //  change theme
  themeChanger.addEventListener("click", (e) => {
    const currentTheme = document.body.classList.contains("dark")
      ? "light"
      : "dark";
    let themeText = currentTheme === "dark" ? "light mode" : "Dark mode"
    // const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    // console.log(newTheme)
    e.target.innerText = themeText;
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", currentTheme);
    localStorage.setItem("theme-text",themeText)
  });

// filter searcher country
inputField.addEventListener('input', (e) => {
  let value = e.target.value.toLowerCase();
  console.log(value)
  const searchedValue = searchQuery.filter((country) => country.name.common.toLowerCase().includes(value));
  console.log(searchedValue)
  createCountryUiDynamically(searchedValue)

});
  // Fetch countries
  fetch("https://restcountries.com/v3.1/all")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      searchQuery = data;
      let regionList = new Set();
      data.forEach((country) => {
        regionList.add(country.region);
      });

      // Build region list
      let regionListHTML = "";
      regionList.forEach((region) => {
        regionListHTML += `<li><a class="region-list" href="index.html?region=${encodeURIComponent(
          region
        )}">${region}</a></li>`;
      });
      regionListUl.innerHTML = regionListHTML;
      const regionListLink = document.querySelectorAll(".region-list");
      regionListLink.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          let selected = (document.querySelector(".country-name").innerText =
            e.target.innerText);
          getCountryByRegion(selected);
        });
      });

      // Check if a region is specified in the URL
      if (regionQuery) {
        getCountryByRegion(regionQuery);
      } else {
        createCountryUiDynamically(data);
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

function createCountryUiDynamically(data) {
  countriesInfoList.innerHTML = "";
  let countryCard = "";
  data.forEach((country) => {
    countryCard += `<a class="country-card" href="details.html?name=${encodeURIComponent(
      country.name.common
    )}">
      <img src="${country.flags.svg}" alt="${encodeURIComponent(
      country.name.common
    )} flag" />
      <div class="card-body">
        <h2>${country.name.common}</h2>
        <p><b>Population:</b> <span>${country.population.toLocaleString()}</span></p>
        <p><b>Region:</b> <span>${country.region}</span></p>
        <p><b>Capital:</b> <span>${
          country.capital ? country.capital[0] : "N/A"
        }</span></p>
      </div>
    </a>`;
  });

  countriesInfoList.innerHTML = countryCard;
}

async function getCountryByRegion(region) {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/region/${region}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const data = await response.json();
    createCountryUiDynamically(data);
  } catch (error) {
    console.log(error);
  }
}
