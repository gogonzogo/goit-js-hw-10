import './css/styles.css';
import { countryAPIFetch } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from "notiflix";

const ref = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

ref.input.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));

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

function handleAPIFetch(inputValue) {
  countryAPIFetch(inputValue)
    .then((data) => {
      console.log(data);
      if (data.length > 20) {
        ref.countryList.innerHTML = '';
        ref.countryInfo.innerHTML = '';
        Notify.info("Too many matches found. Please enter a more specific name.");
        return;
      } else if (data.length >= 2 && data.length <= 20) {
        console.log(data.length >= 2 && data.length <= 20);
        ref.countryInfo.innerHTML = '';
        const countryListMarkUp = createCountryListMarkup(data);
        ref.countryList.innerHTML = countryListMarkUp;
      } else if (data.length === 1) {
        ref.countryList.innerHTML = '';
        const countryInfoMarkup = createCountryInfoMarkup(data);
        ref.countryInfo.innerHTML = countryInfoMarkup;
      };
    })
    .catch((error) => {
      ref.countryList.innerHTML = '';
      ref.countryInfo.innerHTML = '';
      Notify.failure("Oops, there is no country with that name");
    });
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



