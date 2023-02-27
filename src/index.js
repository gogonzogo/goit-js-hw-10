import './css/styles.css';
import { countryAPIFetch } from './fetchCountries';
import debounce from 'lodash.debounce';

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
    return;
  } else {
    countryAPIFetch(inputValue);

  };
};

function countriesListMarkup(countriesData) {
  return countriesData.map(country => {
    return `
      <li class="countries-list">
        <li class="countries-info">
          <h2>${country.name.offical}</h2>
          <p><strong>Capital:</strong>${country.capital}</p>
          <p><strong>Population:</strong>${country.population}</p>
          <p><strong>Languages:</strong>${country.languages}</p>
          <svg width="100" height="100">
          <use href="${country.flags.svg}"></use></svg>
        </li>
      </li>
    `;
  }).joing(' ');
};
  
