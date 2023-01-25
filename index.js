"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const quote = document.querySelector(".quote"),
    author = document.querySelector(".author"),
    buttons = document.querySelectorAll(".button"),
    quoList = document.querySelector(".citate-list__list");

  let db;
  openDB();

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
      })
      .catch((error) => {
        console.error(error);
      });
  }

  generateContent(getQuote(URL));

  function openDB() {
    let openDB = indexedDB.open("quotesDB", 2);

    openDB.onerror = (e) => {
      console.error(e);
    };

    openDB.onsuccess = (e) => {
      db = openDB.result;
      getDataFromStore();

      buttons.forEach((button) => {
        button.addEventListener("click", (e) => {
          let btn = e.target;

          if (btn.classList.contains("button_generate")) {
            generateContent(getQuote(URL));
          }

          if (btn.classList.contains("button_add")) {
            addToDB();
            getDataFromStore();
          }
        });
      });

      console.log("DB opened successfully");
    };

    openDB.onupgradeneeded = (e) => {
      db = openDB.result;

      db.onerror = (e) => {
        console.log("Error in initializing DB");
      };

      if (!db.objectStoreNames.contains("quotes")) {
        const quotesOS = db.createObjectStore("quotes", { keyPath: 'id',
          autoIncrement: true,
        });
      }

      console.log("Object store created.");
    };
  }

  function addToDB() {
    let item = [{ quote: quote.innerHTML, author: author.innerHTML }];
    let tx = db.transaction(["quotes"], "readwrite");
    let store = tx.objectStore("quotes");
    let req = store.put(item[0]);

    req.onsuccess = () => {
      console.log("we did it");
    };
  }

  function getDataFromStore() {
    let tx = db.transaction(["quotes"], "readonly");
    let store = tx.objectStore("quotes");

    let req = store.getAll();

    req.onsuccess = () => {
      renderList(req.result);
      console.log(req.result);
      let btnsDel = document.querySelectorAll("[data-button-id]");
      let listItem = document.querySelectorAll(".list__item");
      findLineToDelete(btnsDel, listItem);
    };
  }

  function renderList(data) {
    quoList.innerHTML = "";

    data.forEach((item) => {
      console.log(item.id);
      let qouteItem = `
          <li class="list__item" data-quote-id='${item.id}'>
            <p class="item__text" data-quote-id='${item.id}'>
              ${item.quote} ${item.author}
            </p>
            <button class="item__button button button_delete" data-button-id='${item.id}'>
              <img src="assets/svg/bin.svg" alt="delete" class="btn-img" data-button-id='${item.id}' />
            </button>
          </li>
        `;

      quoList.insertAdjacentHTML("beforeend", qouteItem);
    });
  }

  function findLineToDelete(btns, list) {
    btns.forEach((btn) =>
      btn.addEventListener("click", (e) => {
        let line = e.target;
        console.log(line);
        if (
          line.classList.contains("button_delete") ||
          line.classList.contains("btn-img")
        ) {
          list.forEach((item) => {
            if (+item.dataset.quoteId == +line.dataset.buttonId) {
              deleteItem(line, item);
            }
          });
        }
      })
    );
  }

  function deleteItem(del, parent) {
    let tx = db.transaction(["quotes"], "readwrite");
    let store = tx.objectStore("quotes");
    let req = store.delete(+del.dataset.buttonId);
    req.onsuccess = () => {
      console.log("deleted");
      parent.remove();
    };
  }

});
