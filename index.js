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
  // addToList();

  function addToList(data) {
    data.forEach(item => {
      let qouteItem = `
      <li class="list__item">
        <p class="item__text" data-quote-id='${item.id}'>
          ${item.quote} ${item.author}
        </p>
        <button class="item__button button button_delete" data-button-id='${item.id}'>
          <img src="assets/svg/bin.svg" alt="delete" />
        </button>
      </li>
    `;
  quoList.insertAdjacentHTML("beforeend", qouteItem);
    });
  }

  function openDB() {
    let openDB = indexedDB.open("quotesDB", 2);

    openDB.onerror = (e) => {
      console.error(e);
    };

    openDB.onsuccess = (e) => {
      db = openDB.result;
      
      addData();
      getDataFromStore();
      console.log("DB opened successfully");
    };

    openDB.onupgradeneeded = (e) => {
      db = openDB.result;

      db.onerror = (e) => {
        console.log("Error in initializing DB");
      };

      if (!db.objectStoreNames.contains("quotes")) {
        const quotesOS = db.createObjectStore("quotes", {
          autoIncrement: true,
        });
      }

      console.log("Object store created.");
    };
  }

  function deleteItem(del) {
    // del.forEach((btnDel) => {
    //   btnDel.addEventListener("click", () => {
        let tx = db.transaction(['quotes'], 'readwrite');
        let store = tx.objectStore('quotes');
        let req = store.delete(del.dataset.buttonId);
        req.onsuccess = () => {
          console.log('deleted');
        };
        del.parentElement.remove();
    //   });
    // });
  }


  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      let btn = e.target;

      if (btn.classList.contains("button_generate")) {
        generateContent(getQuote(URL));
      }

      if (btn.classList.contains("button_add")) {
       
        

        let btnsDel = quoList.querySelectorAll(".button_delete");
        console.log(btnsDel);
        deleteItem(btn);
      }
    });
  });

  function addData() {
    let item = [{ quote: quote.innerHTML, author: author.innerHTML }];
    let tx = db.transaction(["quotes"], "readwrite");
    let store = tx.objectStore("quotes");
    // console.log(id);
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
      console.log(req.result);
      addToList(req.result);
    };
  }

  

});

