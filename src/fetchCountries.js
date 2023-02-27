import { Notify } from "notiflix";

function countryAPIFetch(countryName, markup) {
  return fetch(`https://restcountries.com/v3.1/name/${countryName}?name,capital,population,flags,languages`)
    .then(response => {
      return response.json();
    })
    .then((data) => {
      if (data.length > 10) {
        Notify.info("Too many matches found. Please enter a more specific name.");
      } else if (data.length > 2 && data.length <= 10) {
        console.log(data);
      }
    })
    .catch(() => {
      Notify.failure("Oops, there is no country with that name");
    });
};

export { countryAPIFetch };