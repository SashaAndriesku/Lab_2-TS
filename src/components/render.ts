import { Book } from '../models/Book';
import { User } from '../models/User';
import { Library } from '../services/Library';
import { Storage } from '../services/Storage';
import { Validation } from '../utils/validators';
import { generateNumericId } from '../utils/idGenerator';
import { Modal } from './Modal';

export class AppRenderer {
  private bookLibrary: Library<Book>;
  private userLibrary: Library<User>;
  private bookSearchQuery = '';
  private currentBookPage = 1;
  private currentUsersPage = 1;
  private itemsPerPage = 5;

  constructor() {
    const savedBooks = Storage.load<Book[]>('books') || [];
    const savedUsers = Storage.load<User[]>('users') || [];
    this.bookLibrary = new Library(savedBooks.map((b) => new Book(b.id, b.title, b.author, b.year, b.isBorrowed, b.borrowedBy)));
    this.userLibrary = new Library(savedUsers.map((u) => new User(u.id, u.name, u.email, u.borrowedBookIds)));
  }

  private saveData(): void {
    Storage.save('books', this.bookLibrary.getAll());
    Storage.save('users', this.userLibrary.getAll());
  }

  public init(appContainer: HTMLElement): void {
    this.renderLayout(appContainer);
    this.attachEvents();
    this.updateLists();
  }

  private renderLayout(container: HTMLElement): void {
    container.innerHTML = `
      <div class="container my-4" style="max-width: 900px;">
        <h2 class="text-center mb-4 font-weight-bold">Система Управління Бібліотекою</h2>
        <div class="card mb-4 shadow-sm"><div class="card-body">
          <h5 class="card-title fw-bold">Додати Книгу</h5>
          <form id="book-form">
            <div class="mb-2"><input type="text" id="book-title" class="form-control" placeholder="Назва книги"><div id="book-title-error" class="text-danger small mt-1 d-none">Це поле є обов’язковим</div></div>
            <div class="mb-2"><input type="text" id="book-author" class="form-control" placeholder="Автор"><div id="book-author-error" class="text-danger small mt-1 d-none">Це поле є обов’язковим</div></div>
            <div class="mb-3"><input type="text" id="book-year" class="form-control" placeholder="Рік видання"><div id="book-year-error" class="text-danger small mt-1 d-none">Введіть коректний рік видання</div></div>
            <button type="submit" class="btn btn-success">Додати Книгу</button>
          </form>
        </div></div>
        <div class="card mb-4 shadow-sm"><div class="card-body">
          <h5 class="card-title fw-bold">Додати Користувача</h5>
          <form id="user-form">
            <div class="mb-2"><input type="text" id="user-name" class="form-control" placeholder="Ім'я"><div id="user-name-error" class="text-danger small mt-1 d-none">Це поле є обов’язковим</div></div>
            <div class="mb-3"><input type="text" id="user-email" class="form-control" placeholder="Email"><div id="user-email-error" class="text-danger small mt-1 d-none">Введіть коректний Email</div></div>
            <button type="submit" class="btn btn-success">Додати Користувача</button>
          </form>
        </div></div>
        <div class="card mb-4 shadow-sm"><div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="card-title fw-bold mb-0">Список Книг</h5>
            <input type="text" id="book-search" class="form-control w-50" placeholder="Пошук за назвою або автором...">
          </div>
          <div id="book-list-container"></div>
          <div id="book-pagination" class="d-flex justify-content-center gap-2 mt-3"></div>
        </div></div>
        <div class="card mb-4 shadow-sm"><div class="card-body">
          <h5 class="card-title fw-bold mb-3">Список Користувачів</h5>
          <div id="user-list-container"></div>
          <div id="user-pagination" class="d-flex justify-content-center gap-2 mt-3"></div>
        </div></div>
      </div>`;
  }

  private attachEvents(): void {
    document.getElementById('book-form')?.addEventListener('submit', (e) => { e.preventDefault(); this.handleAddBook(); });
    document.getElementById('user-form')?.addEventListener('submit', (e) => { e.preventDefault(); this.handleAddUser(); });
    document.getElementById('book-search')?.addEventListener('input', (e) => {
      this.bookSearchQuery = (e.target as HTMLInputElement).value.toLowerCase();
      this.currentBookPage = 1;
      this.updateLists();
    });

    document.getElementById('book-list-container')?.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('button');
      if (!btn) return;
      const id = btn.getAttribute('data-id') || '';
      if (btn.classList.contains('borrow-btn')) this.handleBorrowBook(id);
      else if (btn.classList.contains('return-btn')) this.handleReturnBook(id);
      else if (btn.classList.contains('delete-book-btn')) {
        this.removeAndRefresh(this.bookLibrary, id, (b) => {
          if (b.isBorrowed) Modal.show('Помилка', 'Неможливо видалити книгу, яка зараз видана користувачу!');
          return !b.isBorrowed;
        });
      }
    });

    document.getElementById('user-list-container')?.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('button');
      if (btn?.classList.contains('delete-user-btn')) {
        const id = btn.getAttribute('data-id') || '';
        this.removeAndRefresh(this.userLibrary, id, (u) => {
          const hasBooks = u.borrowedBookIds && u.borrowedBookIds.length > 0;
          if (hasBooks) Modal.show('Помилка', 'Неможливо видалити користувача, у якого є неповернуті книги!');
          return !hasBooks;
        });
      }
    });
  }

  private removeAndRefresh<T extends { id: string }>(lib: Library<T>, id: string, validator: (item: T) => boolean): void {
    if (lib.remove(id, validator)) {
      this.saveData();
      this.updateLists();
    }
  }

  private handleAddBook(): void {
    const title = (document.getElementById('book-title') as HTMLInputElement);
    const author = (document.getElementById('book-author') as HTMLInputElement);
    const year = (document.getElementById('book-year') as HTMLInputElement);

    const v1 = Validation.isRequired(title.value), v2 = Validation.isRequired(author.value), v3 = Validation.isValidYear(year.value);
    this.toggleError('book-title-error', !v1);
    this.toggleError('book-author-error', !v2);
    this.toggleError('book-year-error', !v3);

    if (v1 && v2 && v3) {
      this.bookLibrary.add(new Book(generateNumericId(), title.value.trim(), author.value.trim(), parseInt(year.value.trim(), 10)));
      title.value = author.value = year.value = '';
      this.saveData();
      this.updateLists();
    }
  }

  private handleAddUser(): void {
    const name = (document.getElementById('user-name') as HTMLInputElement);
    const email = (document.getElementById('user-email') as HTMLInputElement);

    const v1 = Validation.isRequired(name.value), v2 = Validation.isValidEmail(email.value);
    this.toggleError('user-name-error', !v1);
    this.toggleError('user-email-error', !v2);

    if (v1 && v2) {
      this.userLibrary.add(new User(generateNumericId(), name.value.trim(), email.value.trim()));
      name.value = email.value = '';
      this.saveData();
      this.updateLists();
    }
  }

  private toggleError(id: string, show: boolean): void {
    document.getElementById(id)?.classList.toggle('d-none', !show);
  }

  private updateLists(): void {
    this.renderBooks();
    this.renderUsers();
  }

  private getPaginatedItems<T>(items: T[], page: number): { items: T[]; totalPages: number; page: number } {
    const totalPages = Math.ceil(items.length / this.itemsPerPage) || 1;
    const validPage = Math.min(page, totalPages);
    const start = (validPage - 1) * this.itemsPerPage;
    return { items: items.slice(start, start + this.itemsPerPage), totalPages, page: validPage };
  }

  private renderBooks(): void {
    const container = document.getElementById('book-list-container');
    if (!container) return;

    let books = this.bookLibrary.getAll();
    if (this.bookSearchQuery) {
      books = books.filter(b => b.title.toLowerCase().includes(this.bookSearchQuery) || b.author.toLowerCase().includes(this.bookSearchQuery));
    }

    const { items, totalPages, page } = this.getPaginatedItems(books, this.currentBookPage);
    this.currentBookPage = page;

    container.innerHTML = items.length === 0 ? '<p class="text-muted">Книг не знайдено.</p>' : items.map(b => `
      <div class="d-flex justify-content-between align-items-center border-bottom py-2">
        <div><strong>${b.title}</strong> by ${b.author} (${b.year})</div>
        <div class="d-flex gap-2">
          <button class="btn btn-${b.isBorrowed ? 'warning' : 'primary'} btn-sm ${b.isBorrowed ? 'return' : 'borrow'}-btn" data-id="${b.id}">${b.isBorrowed ? 'Повернути' : 'Позичити'}</button>
          <button class="btn btn-outline-danger btn-sm delete-book-btn" data-id="${b.id}">Видалити</button>
        </div>
      </div>`).join('');

    this.renderPagination('book-pagination', totalPages, page, p => { this.currentBookPage = p; this.renderBooks(); });
  }

  private handleBorrowBook(bookId: string): void {
    const book = this.bookLibrary.findById(bookId);
    if (!book) return;
    Modal.prompt('Введіть ID користувача для позичення книги:', 'ID користувача', (userId) => {
      const user = this.userLibrary.findById(userId);
      if (!user) return Modal.show('Помилка', `Користувача з ID ${userId} не знайдено!`);
      if (!user.canBorrow()) return Modal.show('Обмеження', `Користувач ${user.name} вже позичив максимально можливу кількість книг (3)!`);
      book.borrow(user.id);
      user.addBook(book.id);
      this.saveData();
      this.updateLists();
      Modal.show('Успішно', `${book.title} by ${book.author} (${book.year}) has been borrowed by ${user.id} ${user.name} (${user.email}).`);
    });
  }

  private handleReturnBook(bookId: string): void {
    const book = this.bookLibrary.findById(bookId);
    if (!book) return;
    if (book.borrowedBy) this.userLibrary.findById(book.borrowedBy)?.removeBook(book.id);
    book.returnBook();
    this.saveData();
    this.updateLists();
    Modal.show('Повернення', `${book.title} by ${book.author} (${book.year}) has been returned.`, 'Закрити');
  }

  private renderUsers(): void {
    const container = document.getElementById('user-list-container');
    if (!container) return;

    const { items, totalPages, page } = this.getPaginatedItems(this.userLibrary.getAll(), this.currentUsersPage);
    this.currentUsersPage = page;

    container.innerHTML = items.length === 0 ? '<p class="text-muted">Користувачів немає.</p>' : items.map(u => `
      <div class="d-flex justify-content-between align-items-center border-bottom py-2">
        <div><strong>${u.id}</strong> ${u.name} (${u.email}) [Позичено книг: ${u.borrowedBookIds.length}/3]</div>
        <button class="btn btn-outline-danger btn-sm delete-user-btn" data-id="${u.id}">Видалити</button>
      </div>`).join('');

    this.renderPagination('user-pagination', totalPages, page, p => { this.currentUsersPage = p; this.renderUsers(); });
  }

  private renderPagination(containerId: string, totalPages: number, currentPage: number, onPageChange: (p: number) => void): void {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (totalPages <= 1) { container.innerHTML = ''; return; }

    let buttons = '';
    for (let i = 1; i <= totalPages; i++) {
      buttons += `<button class="btn ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'} btn-sm page-btn" data-page="${i}">${i}</button>`;
    }
    container.innerHTML = buttons;
    container.onclick = (e) => {
      const btn = (e.target as HTMLElement).closest('.page-btn');
      if (btn) onPageChange(parseInt(btn.getAttribute('data-page') || '1', 10));
    };
  }
}