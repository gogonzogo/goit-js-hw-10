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

function handleInput(e) {
  e.preventDefault();
  let inputValue = e.target.value.trim();
  if (inputValue === '') {
    ref.countryList.innerHTML = '';
    ref.countryInfo.innerHTML = '';
    return;
  }

  countryAPIFetch(inputValue)
    .then((data) => {
      console.log(data);
      if (data.length > 10) {
        ref.countryList.innerHTML = '';
        ref.countryInfo.innerHTML = '';
        Notify.info("Too many matches found. Please enter a more specific name.");
        return;
      };
      
      if (data.length >= 2 && data.length <= 10) {
        console.log(data.length >= 2 && data.length <= 10);
        ref.countryInfo.innerHTML = '';
        const countryListMarkUp = createCountryListMarkup(data);
        ref.countryList.innerHTML = countryListMarkUp;
      };
      
      if (data.length === 1) {
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

function createCountryListMarkup(countriesData) {
  return countriesData.map((country) =>
    `<li class="country-list__item">
      <img class="country-list__img" src="${country.flags.svg}" alt="${country.flags.alt}" width="40" height="20">
      <p class="country-list__country-name">${country.name.official}</p>
    </li>`
  ).join(' ');
};

function createCountryInfoMarkup(countryData) {
  return countryData.map((country) => 
    `
    <div class="country-info__img-header-container">
    <img class="country-info__img" src="${country.flags.svg}" alt="${country.flags.alt}" width="40" height="20">
    <h1 class="country-info__header">${country.name.official}</h1>
    </div>
    <p class="country-info__details"><b>Capital: </b>${country.capital}</p>
    <p class="country-info__details"><b>Population: </b>${country.population}</p>
    <p class="country-info__details"><b>Languages: </b>${Object.values(country.languages)}</p>`
  ).join(' ');
};

