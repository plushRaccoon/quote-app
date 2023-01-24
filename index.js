"use strict";

const quote = document.querySelector(".quote"),
  author = document.querySelector(".author"),
  buttons = document.querySelectorAll(".button"),
  quoList = document.querySelector(".citate-list__list"),
  ID = document.querySelectorAll("[data-id]");

let URL = "https://api.quotable.io/random";

async function getQuote(url) {
  let response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error in ${url} status: ${response.status}`);
  }

  return await response.json();
}

function generateContent(func) {
  return func
    .then((data) => {
      quote.innerHTML = data.content;
      author.innerHTML = data.author;
      quote.dataset.id = `${data._id}`;
      author.dataset.id = `${data._id}`;
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

generateContent(getQuote(URL));

function addToList() {
  let qouteItem;
  let quoText = quote.innerHTML;
  qouteItem = `
        <li class="list__item">
          <p class="item__text" data-id='${quote.dataset.id}'>
            ${quoText} ${author.innerHTML}
          </p>
          <button class="item__button button button_delete">
            <img src="assets/svg/bin.svg" alt="delete" />
          </button>
        </li>
      `;
  quoList.insertAdjacentHTML("beforeend", qouteItem);
}

function deleteItem(del) {
  del.forEach((btnDel) => {
    btnDel.addEventListener("click", () => {
      btnDel.parentElement.remove();
    });
  });
}

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    let btn = e.target;

    if (btn.classList.contains("button_generate")) {
      generateContent(getQuote(URL));
    }

    if (btn.classList.contains("button_add")) {
      addToList();

      let btnsDel = document.querySelectorAll(".button_delete");
      deleteItem(btnsDel);
    }
  });
});
