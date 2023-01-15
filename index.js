"use strict";

const quote = document.querySelector(".quote"),
  author = document.querySelector(".author"),
  newQuote = document.querySelector('.button_generate'),
  addQuote = document.querySelector('.button_add'),
  delQuote = document.querySelector('.button_delete');


let URL = "https://api.quotable.io/random";

async function getQuote(url) {
  let response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error in ${url} status: ${response.status}`);
  }

  return await response.json();
}

getQuote(URL)
  .then(data => {
    quote.innerHTML = data.content;
    author.innerHTML = data.author;
  })
  .catch(error => {
    console.error(error);
  });

newQuote.addEventListener('click', () => {
  getQuote(URL)
  .then(data => {
    quote.innerHTML = data.content;
    author.innerHTML = data.author;
  })
  .catch(error => {
    console.log(error);
  });
});
