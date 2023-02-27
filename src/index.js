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
  if (!inputValue) {
    return;
  }

  countryAPIFetch(inputValue)
    .then((data) => {
      console.log(data);
      if (data.length > 10) {
        Notify.info("Too many matches found. Please enter a more specific name.");
        return;
      } else if (data.length > 2 && data.length <= 10) {
        console.log(data.length > 2 && data.length <= 10);
        countryListMarkup(data);
      } else if (data.length === 1) {
        countryInfoMarkup(data);
      };
    })
    .catch((error) => {
      Notify.failure("Oops, there is no country with that name");
    });
  };

function countryListMarkup(countriesData) {
  return data.map(country => {
    `<li>
      <svg width="70" height="50"><use href="${country.flags.svg}"></use></svg>
      <p>${country.name.official}</p>
    </li>`;
  }).join('');
};

function countryInfoMarkup(countryData) {
  return countryData.map(country => {
    return `
      <svg width="100" height="80"><use href="${country.flags.svg}"></use></svg>
      <h1>${country.name.offical}</h1>
      <p><b>Capital:</b>${country.capital}</p>
      <p><b>Population:</b>${country.population}</p>
      <p><b>Languages:</b>${country.languages}</p>`;
  }).joing(' ');
};

