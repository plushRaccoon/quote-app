"use strict";

const quote = document.querySelector(".quote"),
  author = document.querySelector(".author"),
  buttons = document.querySelectorAll(".button"),
  quoList = document.querySelector(".citate-list__list");


let URL = "https://api.quotable.io/random";

async function getQuote(url) {
  let response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error in ${url} status: ${response.status}`);
  }

  return await response.json();
}

getQuote(URL)
  .then((data) => {
    quote.innerHTML = data.content;
    author.innerHTML = data.author;
  })
  .catch((error) => {
    console.error(error);
  });

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    let btn = e.target;

    if (btn.classList.contains("button_generate")) {
      getQuote(URL)
        .then((data) => {
          quote.innerHTML = data.content;
          author.innerHTML = data.author;
        })
        .catch((error) => {
          console.log(error);
        });
    }

    let qouteItem;

    if (btn.classList.contains("button_add")) {
      let quoText = quote.innerHTML;
      // if (quote.innerHTML.length > 70) {
      //   quoText = quote.innerHTML.slice(0, 70) + '...';
      // } else {
      //   quoText = quote.innerHTML;
      // }
      qouteItem = `
        <li class="list__item">
          <p class="item__text">
            ${quoText} ${author.innerHTML}
          </p>
          <button class="item__button button button_delete">
            <img src="/assets/svg/bin.svg" alt="delete" />
          </button>
        </li>
      `;
      quoList.insertAdjacentHTML("beforeend", qouteItem);

      let btnsDel = document.querySelectorAll('.button_delete');

      btnsDel.forEach(btnDel => {
        btnDel.addEventListener('click', (e) => {
          btnDel.parentElement.remove();
        });
      });
    }
  });
  });
