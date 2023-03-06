import './css/styles.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { countryAPIFetch } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from "notiflix";
import mapboxgl from 'mapbox-gl'; 
import { flyToCountry } from './js/mapbox';

const ref = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
  flyBtn: document.querySelector('#fly'),
};


ref.flyBtn.disabled = true;

const DEBOUNCE_DELAY = 300;

ref.input.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));
ref.countryList.addEventListener('click', handleCountryListClick);

function handleAPIFetch(inputValue) {
  countryAPIFetch(inputValue)
    .then((data) => {
      if (data.length > 10) {
        ref.countryList.innerHTML = '';
        ref.countryInfo.innerHTML = '';
        Notify.info("Too many matches found. Please enter a more specific name.");
        return;
      } else if (data.length >= 2 && data.length <= 10) {
        ref.countryInfo.innerHTML = '';
        const countryListMarkUp = createCountryListMarkup(data);
        ref.countryList.innerHTML = countryListMarkUp;
      } else if (data.length === 1) {
        ref.countryList.innerHTML = '';
        const countryInfoMarkup = createCountryInfoMarkup(data);
        ref.countryInfo.innerHTML = countryInfoMarkup;
        let flyTo = getCordinates(data);
        flyToCountry(flyTo);
        ref.flyBtn.disabled = false;
      };
    })
    .catch((error) => {
      ref.countryList.innerHTML = '';
      ref.countryInfo.innerHTML = '';
      Notify.failure("Oops, there is no country with that name");
    });
};

function createCountryInfoMarkup(countryData) {
  return countryData.map((country) => 
    `<ul class="country-info__list">
      <li class="country-info__item">
          <img class="country-info__img" src="${country.flags.svg}" alt="${country.flags.alt}" width="200">
          <h1 class="country-info__header">${country.name.official}</h1>
          <p class="country-info__details"><b>Capital: </b>${country.capital}</p>
          <p class="country-info__details"><b>Population: </b>${parseInt(country.population).toLocaleString("en-US")}</p>
          <p class="country-info__details"><b>Languages: </b>${Object.values(country.languages)}</p>
      </li>
    </ul>`
  ).join(' ');
};

function createCountryListMarkup(countriesData) {
  return countriesData.map((country) =>
    `<li class="country-list__item">
        <img class="country-list__img" src="${country.flags.svg}" alt="${country.flags.alt}" width="100" >
        <h6 class="country-list__country-name">${country.name.official}</h6>
    </li>`
  ).join(' ');
};

function handleInput(e) {
  let inputValue = e.target.value.trim();
  if (inputValue === '') {
    flyToCountry([42, 43.5]);
    ref.countryList.innerHTML = '';
    ref.countryInfo.innerHTML = '';
    return;
  } else {
    handleAPIFetch(inputValue);
  };
};

function handleCountryListClick(e) {
  if (!e.target.parentElement === "LI") {
    return;
  } else {
    let countryName = e.target.parentElement.querySelector('.country-list__country-name').textContent;
    handleAPIFetch(countryName);
    ref.input.value = countryName;
  };
};

function getCordinates(data) {
    let cordinates = data.flatMap(country => country.latlng);
    return cordinates.reverse();
  }

flyToCountry([80, 36]);

Notify.init({
  position: 'center-top',
  width: '600px',
  height: '100px',
  fontSize: '20px'
});






