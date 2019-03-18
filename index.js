'use strict';

const apiKey = 'AIzaSyBUMxuCtsf6pxTpM9rZv4lTmTKrj0G39z0'; 
const searchURL = 'https://api.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  for (let i = 0; i < responseJson.data.length; i++){
    $('#results-list').append(
      `<li><h3><a href='${responseJson.data[i].url}'>${responseJson.data[i].fullName}</a></h3>
      <p>Located in: ${responseJson.data[i].states}</p>
      <p>${responseJson.data[i].description}</p>
      </li>`
    )};
  $('#results').removeClass('hidden');
  $( "#submit-button" ).click(function() {
  $( "#no-result-message" ).empty();
});
}



function getParkInfo(query, maxResults=10, state) {
  const params = {
    key: apiKey,
    q: query,
    maxResults,
    stateCode: state
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;
  const searchTerm = $('#js-search-term').val();
  console.log(url);

  fetch(url)
    .then(response => {
       if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      if(!responseJson.data.length) {
     $('#no-result-message').text(`Sorry! Looks like there aren't any results matching ${searchTerm} in ${state}. Please try again.`);
      } 
      console.log(responseJson);
      displayResults(responseJson);
      
    })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function stateArray(state) {
  const newArray = state.split(" ");
  console.log('newArray is ', newArray);

  return newArray
}
/*
$( "#submit-button" ).click(function() {
  $( "#no-result-message" ).empty();
});
*/


function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    const state = $('#js-search-states').val();
    if (state.length > 2) {
      const states = stateArray(state);
    getParkInfo(searchTerm, maxResults, states);
    } else {
      getParkInfo(searchTerm, maxResults, state);
    }
  });
}

$(watchForm);
