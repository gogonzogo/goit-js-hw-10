import './css/styles.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { countryAPIFetch } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from "notiflix";
import mapboxgl from 'mapbox-gl';  // or "const mapboxgl = require('mapbox-gl');"
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
      // flyToCountry([80, 36]);
      ref.countryList.innerHTML = '';
      ref.countryInfo.innerHTML = '';
      Notify.failure("Oops, there is no country with that name");
    });
};

function createCountryInfoMarkup(countryData) {
  return countryData.map((country) => 
    `<ul class="country-info__list">
      <li class="country-info__item">
        <div class="country-info__img-header-container">
          <img class="country-info__img" src="${country.flags.svg}" alt="${country.flags.alt}" width="20" height="20">
          <h1 class="country-info__header">${country.name.official}</h1>
        </div>
        <div class="country-info__details-container">
          <p class="country-info__details"><b>Capital: </b>${country.capital}</p>
          <p class="country-info__details"><b>Population: </b>${country.population}</p>
          <p class="country-info__details"><b>Languages: </b>${Object.values(country.languages)}</p>
        </div>
      </li>
    </ul>`
  ).join(' ');
};

function createCountryListMarkup(countriesData) {
  return countriesData.map((country) =>
    `<li class="country-list__item">
      <div class="country-list__overlay-container">
        <img class="country-list__img" src="${country.flags.svg}" alt="${country.flags.alt}" width="200" >
        <div class="country-list__overlay">
          <p class="country-list__overlay-text"><b>Capital: </b>${country.capital}</p>
          <p class="country-list__overlay-text"><b>Population: </b>${country.population}</p>
          <p class="country-list__overlay-text"><b>Languages: </b>${Object.values(country.languages)}</p>
        </div>
      </div>
      <div class="country-list__text-container">
        <p class="country-list__country-name">${country.name.official}</p>
      </div>
    </li>`
  ).join(' ');
};

function handleInput(e) {
  let inputValue = e.target.value.trim();
  if (inputValue === '') {
    ref.countryList.innerHTML = '';
    ref.countryInfo.innerHTML = '';
    return;
  } else {
    handleAPIFetch(inputValue);
  };
};

function getCordinates(data) {
    let cordinates = data.flatMap(country => country.latlng);
    return cordinates.reverse();
  }

flyToCountry([80, 36]);

