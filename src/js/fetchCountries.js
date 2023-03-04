const FINAL_URL = 'https://restcountries.com/v3.1/name/';
const RETURN_PROPERTIES = '?fields=name,capital,population,flags,languages,latlng';

function countryAPIFetch(countryName) {
  return fetch(`${FINAL_URL}${countryName}${RETURN_PROPERTIES}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })  
};

export { countryAPIFetch };