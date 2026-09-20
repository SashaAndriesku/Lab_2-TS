(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=class{id;title;author;year;isBorrowed;borrowedBy;constructor(e,t,n,r,i=!1,a){this.id=e,this.title=t,this.author=n,this.year=r,this.isBorrowed=i,this.borrowedBy=a}borrow(e){this.isBorrowed=!0,this.borrowedBy=e}returnBook(){this.isBorrowed=!1,this.borrowedBy=void 0}},t=class{id;name;email;borrowedBookIds;constructor(e,t,n,r=[]){this.id=e,this.name=t,this.email=n,this.borrowedBookIds=r}canBorrow(){return this.borrowedBookIds.length<3}addBook(e){this.canBorrow()&&this.borrowedBookIds.push(e)}removeBook(e){this.borrowedBookIds=this.borrowedBookIds.filter(t=>t!==e)}},n=class{items=[];constructor(e=[]){this.items=e}add(e){this.items.push(e)}remove(e){let t=this.items.findIndex(t=>t.id===e);return t!==-1&&(this.items.splice(t,1),!0)}findById(e){return this.items.find(t=>t.id===e)}getAll(){return[...this.items]}clear(){this.items=[]}},r=class{static save(e,t){localStorage.setItem(e,JSON.stringify(t))}static load(e){let t=localStorage.getItem(e);if(!t)return null;try{return JSON.parse(t)}catch{return null}}static remove(e){localStorage.removeItem(e)}},i;(function(e){function t(e){return e.trim().length>0}e.isRequired=t;function n(e){return/^\d+$/.test(e.trim())}e.isDigitsOnly=n;function r(e){if(!n(e))return!1;let t=parseInt(e,10),r=new Date().getFullYear();return t>=1e3&&t<=r}e.isValidYear=r;function i(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())}e.isValidEmail=i})(i||={});function a(){return Date.now().toString()+Math.floor(Math.random()*100).toString()}var o=class{static show(e,t,n=`Зрозуміло!`,r){let i=document.getElementById(`custom-modal`);i&&i.remove();let a=document.createElement(`div`);a.id=`custom-modal`,a.className=`modal fade show d-block`,a.style.backgroundColor=`rgba(0, 0, 0, 0.5)`,a.innerHTML=`
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow">
          <div class="modal-header">
            <h5 class="modal-title fs-5">${e}</h5>
            <button type="button" class="btn-close" id="modal-close-btn"></button>
          </div>
          <div class="modal-body py-4">
            <p class="mb-0">${t}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="modal-confirm-btn">${n}</button>
          </div>
        </div>
      </div>
    `,document.body.appendChild(a);let o=()=>a.remove();document.getElementById(`modal-close-btn`)?.addEventListener(`click`,o),document.getElementById(`modal-confirm-btn`)?.addEventListener(`click`,()=>{o(),r&&r()})}static prompt(e,t,n){let r=document.getElementById(`custom-modal`);r&&r.remove();let i=document.createElement(`div`);i.id=`custom-modal`,i.className=`modal fade show d-block`,i.style.backgroundColor=`rgba(0, 0, 0, 0.5)`,i.innerHTML=`
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow">
          <div class="modal-header">
            <h5 class="modal-title fs-5">${e}</h5>
            <button type="button" class="btn-close" id="modal-close-btn"></button>
          </div>
          <div class="modal-body py-3">
            <input type="text" id="modal-prompt-input" class="form-control" placeholder="${t}">
            <div id="modal-error" class="text-danger mt-2 small d-none"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="modal-cancel-btn">Скасувати</button>
            <button type="button" class="btn btn-primary" id="modal-save-btn">Зберегти</button>
          </div>
        </div>
      </div>
    `,document.body.appendChild(i);let a=()=>i.remove();document.getElementById(`modal-close-btn`)?.addEventListener(`click`,a),document.getElementById(`modal-cancel-btn`)?.addEventListener(`click`,a),document.getElementById(`modal-save-btn`)?.addEventListener(`click`,()=>{let e=document.getElementById(`modal-prompt-input`);if(e&&e.value.trim()){let t=e.value.trim();a(),n(t)}else{let e=document.getElementById(`modal-error`);e&&(e.textContent=`Це поле є обов’язковим`,e.classList.remove(`d-none`))}})}},s=class{bookLibrary;userLibrary;bookSearchQuery=``;currentBookPage=1;currentUsersPage=1;itemsPerPage=5;constructor(){let i=r.load(`books`)||[],a=r.load(`users`)||[];this.bookLibrary=new n(i.map(t=>new e(t.id,t.title,t.author,t.year,t.isBorrowed,t.borrowedBy))),this.userLibrary=new n(a.map(e=>new t(e.id,e.name,e.email,e.borrowedBookIds)))}saveData(){r.save(`books`,this.bookLibrary.getAll()),r.save(`users`,this.userLibrary.getAll())}init(e){this.renderLayout(e),this.attachEvents(),this.updateLists()}renderLayout(e){e.innerHTML=`
      <div class="container my-4" style="max-width: 900px;">
        <h2 class="text-center mb-4 font-weight-bold">Система Управління Бібліотекою</h2>

        <!-- Додати Книгу -->
        <div class="card mb-4 shadow-sm">
          <div class="card-body">
            <h5 class="card-title fw-bold">Додати Книгу</h5>
            <form id="book-form">
              <div class="mb-2">
                <input type="text" id="book-title" class="form-control" placeholder="Назва книги">
                <div id="book-title-error" class="text-danger small mt-1 d-none">Це поле є обов’язковим</div>
              </div>
              <div class="mb-2">
                <input type="text" id="book-author" class="form-control" placeholder="Автор">
                <div id="book-author-error" class="text-danger small mt-1 d-none">Це поле є обов’язковим</div>
              </div>
              <div class="mb-3">
                <input type="text" id="book-year" class="form-control" placeholder="Рік видання">
                <div id="book-year-error" class="text-danger small mt-1 d-none">Введіть коректний рік видання</div>
              </div>
              <button type="submit" class="btn btn-success">Додати Книгу</button>
            </form>
          </div>
        </div>

        <!-- Додати Користувача -->
        <div class="card mb-4 shadow-sm">
          <div class="card-body">
            <h5 class="card-title fw-bold">Додати Користувача</h5>
            <form id="user-form">
              <div class="mb-2">
                <input type="text" id="user-name" class="form-control" placeholder="Ім'я">
                <div id="user-name-error" class="text-danger small mt-1 d-none">Це поле є обов’язковим</div>
              </div>
              <div class="mb-3">
                <input type="text" id="user-email" class="form-control" placeholder="Email">
                <div id="user-email-error" class="text-danger small mt-1 d-none">Введіть коректний Email</div>
              </div>
              <button type="submit" class="btn btn-success">Додати Користувача</button>
            </form>
          </div>
        </div>

        <!-- Список Книг -->
        <div class="card mb-4 shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="card-title fw-bold mb-0">Список Книг</h5>
              <input type="text" id="book-search" class="form-control w-50" placeholder="Пошук за назвою або автором...">
            </div>
            <div id="book-list-container"></div>
            <div id="book-pagination" class="d-flex justify-content-center gap-2 mt-3"></div>
          </div>
        </div>

        <!-- Список Користувачів -->
        <div class="card mb-4 shadow-sm">
          <div class="card-body">
            <h5 class="card-title fw-bold mb-3">Список Користувачів</h5>
            <div id="user-list-container"></div>
            <div id="user-pagination" class="d-flex justify-content-center gap-2 mt-3"></div>
          </div>
        </div>
      </div>
    `}attachEvents(){document.getElementById(`book-form`)?.addEventListener(`submit`,e=>{e.preventDefault(),this.handleAddBook()}),document.getElementById(`user-form`)?.addEventListener(`submit`,e=>{e.preventDefault(),this.handleAddUser()}),document.getElementById(`book-search`)?.addEventListener(`input`,e=>{let t=e.target;this.bookSearchQuery=t.value.toLowerCase(),this.currentBookPage=1,this.updateLists()})}handleAddBook(){let t=document.getElementById(`book-title`),n=document.getElementById(`book-author`),r=document.getElementById(`book-year`),o=i.isRequired(t.value),s=i.isRequired(n.value),c=i.isValidYear(r.value);if(this.toggleError(`book-title-error`,!o),this.toggleError(`book-author-error`,!s),this.toggleError(`book-year-error`,!c),o&&s&&c){let i=new e(a(),t.value.trim(),n.value.trim(),parseInt(r.value.trim(),10));this.bookLibrary.add(i),this.saveData(),t.value=``,n.value=``,r.value=``,this.updateLists()}}handleAddUser(){let e=document.getElementById(`user-name`),n=document.getElementById(`user-email`),r=i.isRequired(e.value),o=i.isValidEmail(n.value);if(this.toggleError(`user-name-error`,!r),this.toggleError(`user-email-error`,!o),r&&o){let r=new t(a(),e.value.trim(),n.value.trim());this.userLibrary.add(r),this.saveData(),e.value=``,n.value=``,this.updateLists()}}toggleError(e,t){let n=document.getElementById(e);n&&(t?n.classList.remove(`d-none`):n.classList.add(`d-none`))}updateLists(){this.renderBooks(),this.renderUsers()}renderBooks(){let e=document.getElementById(`book-list-container`);if(!e)return;let t=this.bookLibrary.getAll();this.bookSearchQuery&&(t=t.filter(e=>e.title.toLowerCase().includes(this.bookSearchQuery)||e.author.toLowerCase().includes(this.bookSearchQuery)));let n=Math.ceil(t.length/this.itemsPerPage)||1;this.currentBookPage>n&&(this.currentBookPage=n);let r=(this.currentBookPage-1)*this.itemsPerPage,i=t.slice(r,r+this.itemsPerPage);e.innerHTML=i.length===0?`<p class="text-muted">Книг не знайдено.</p>`:i.map(e=>{let t=e.isBorrowed?`<button class="btn btn-warning btn-sm return-btn" data-id="${e.id}">Повернути</button>`:`<button class="btn btn-primary btn-sm borrow-btn" data-id="${e.id}">Позичити</button>`;return`
          <div class="d-flex justify-content-between align-items-center border-bottom py-2">
            <div>
              <strong>${e.title}</strong> by ${e.author} (${e.year})
            </div>
            <div class="d-flex gap-2">
              ${t}
              <button class="btn btn-outline-danger btn-sm delete-book-btn" data-id="${e.id}">Видалити</button>
            </div>
          </div>
        `}).join(``),this.renderPagination(`book-pagination`,n,this.currentBookPage,e=>{this.currentBookPage=e,this.renderBooks()}),e.querySelectorAll(`.borrow-btn`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.target.getAttribute(`data-id`);t&&this.handleBorrowBook(t)})}),e.querySelectorAll(`.return-btn`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.target.getAttribute(`data-id`);t&&this.handleReturnBook(t)})}),e.querySelectorAll(`.delete-book-btn`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.target.getAttribute(`data-id`);t&&(this.bookLibrary.remove(t),this.saveData(),this.updateLists())})})}handleBorrowBook(e){let t=this.bookLibrary.findById(e);t&&o.prompt(`Введіть ID користувача для позичення книги:`,`ID користувача`,e=>{let n=this.userLibrary.findById(e);if(!n){o.show(`Помилка`,`Користувача з ID ${e} не знайдено!`);return}if(!n.canBorrow()){o.show(`Обмеження`,`Користувач ${n.name} вже позичив максимально можливу кількість книг (3)!`);return}t.borrow(n.id),n.addBook(t.id),this.saveData(),this.updateLists(),o.show(`Успішно`,`${t.title} by ${t.author} (${t.year}) has been borrowed by ${n.id} ${n.name} (${n.email}).`)})}handleReturnBook(e){let t=this.bookLibrary.findById(e);if(t){if(t.borrowedBy){let e=this.userLibrary.findById(t.borrowedBy);e&&e.removeBook(t.id)}t.returnBook(),this.saveData(),this.updateLists(),o.show(`Повернення`,`${t.title} by ${t.author} (${t.year}) has been returned.`,`Закрити`)}}renderUsers(){let e=document.getElementById(`user-list-container`);if(!e)return;let t=this.userLibrary.getAll(),n=Math.ceil(t.length/this.itemsPerPage)||1;this.currentUsersPage>n&&(this.currentUsersPage=n);let r=(this.currentUsersPage-1)*this.itemsPerPage,i=t.slice(r,r+this.itemsPerPage);e.innerHTML=i.length===0?`<p class="text-muted">Користувачів немає.</p>`:i.map(e=>`
        <div class="d-flex justify-content-between align-items-center border-bottom py-2">
          <div>
            <strong>${e.id}</strong> ${e.name} (${e.email}) [Позичено книг: ${e.borrowedBookIds.length}/3]
          </div>
          <button class="btn btn-outline-danger btn-sm delete-user-btn" data-id="${e.id}">Видалити</button>
        </div>
      `).join(``),this.renderPagination(`user-pagination`,n,this.currentUsersPage,e=>{this.currentUsersPage=e,this.renderUsers()}),e.querySelectorAll(`.delete-user-btn`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.target.getAttribute(`data-id`);t&&(this.userLibrary.remove(t),this.saveData(),this.updateLists())})})}renderPagination(e,t,n,r){let i=document.getElementById(e);if(!i||t<=1){i&&(i.innerHTML=``);return}let a=``;for(let e=1;e<=t;e++)a+=`<button class="btn ${e===n?`btn-primary`:`btn-outline-primary`} btn-sm page-btn" data-page="${e}">${e}</button>`;i.innerHTML=a,i.querySelectorAll(`.page-btn`).forEach(e=>{e.addEventListener(`click`,e=>{r(parseInt(e.target.getAttribute(`data-page`)||`1`,10))})})}};document.addEventListener(`DOMContentLoaded`,()=>{let e=document.getElementById(`app`);e&&new s().init(e)});