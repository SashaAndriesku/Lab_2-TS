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

    this.bookLibrary = new Library<Book>(
      savedBooks.map(
        (b) =>
          new Book(b.id, b.title, b.author, b.year, b.isBorrowed, b.borrowedBy)
      )
    );

    this.userLibrary = new Library<User>(
      savedUsers.map((u) => new User(u.id, u.name, u.email, u.borrowedBookIds))
    );
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
    `;
  }

  private attachEvents(): void {
    document.getElementById('book-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAddBook();
    });

    document.getElementById('user-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAddUser();
    });

    document.getElementById('book-search')?.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      this.bookSearchQuery = target.value.toLowerCase();
      this.currentBookPage = 1;
      this.updateLists();
    });
  }

  private handleAddBook(): void {
    const titleEl = document.getElementById('book-title') as HTMLInputElement;
    const authorEl = document.getElementById('book-author') as HTMLInputElement;
    const yearEl = document.getElementById('book-year') as HTMLInputElement;

    const titleValid = Validation.isRequired(titleEl.value);
    const authorValid = Validation.isRequired(authorEl.value);
    const yearValid = Validation.isValidYear(yearEl.value);

    this.toggleError('book-title-error', !titleValid);
    this.toggleError('book-author-error', !authorValid);
    this.toggleError('book-year-error', !yearValid);

    if (titleValid && authorValid && yearValid) {
      const newBook = new Book(
        generateNumericId(),
        titleEl.value.trim(),
        authorEl.value.trim(),
        parseInt(yearEl.value.trim(), 10)
      );
      this.bookLibrary.add(newBook);
      this.saveData();

      titleEl.value = '';
      authorEl.value = '';
      yearEl.value = '';

      this.updateLists();
    }
  }

  private handleAddUser(): void {
    const nameEl = document.getElementById('user-name') as HTMLInputElement;
    const emailEl = document.getElementById('user-email') as HTMLInputElement;

    const nameValid = Validation.isRequired(nameEl.value);
    const emailValid = Validation.isValidEmail(emailEl.value);

    this.toggleError('user-name-error', !nameValid);
    this.toggleError('user-email-error', !emailValid);

    if (nameValid && emailValid) {
      const newUser = new User(
        generateNumericId(),
        nameEl.value.trim(),
        emailEl.value.trim()
      );
      this.userLibrary.add(newUser);
      this.saveData();

      nameEl.value = '';
      emailEl.value = '';

      this.updateLists();
    }
  }

  private toggleError(elementId: string, show: boolean): void {
    const el = document.getElementById(elementId);
    if (el) {
      if (show) el.classList.remove('d-none');
      else el.classList.add('d-none');
    }
  }

  private updateLists(): void {
    this.renderBooks();
    this.renderUsers();
  }

  private renderBooks(): void {
    const container = document.getElementById('book-list-container');
    if (!container) return;

    let filtered = this.bookLibrary.getAll();
    if (this.bookSearchQuery) {
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(this.bookSearchQuery) ||
          b.author.toLowerCase().includes(this.bookSearchQuery)
      );
    }

    const totalPages = Math.ceil(filtered.length / this.itemsPerPage) || 1;
    if (this.currentBookPage > totalPages) this.currentBookPage = totalPages;

    const startIdx = (this.currentBookPage - 1) * this.itemsPerPage;
    const paginated = filtered.slice(startIdx, startIdx + this.itemsPerPage);

    if (paginated.length === 0) {
      container.innerHTML = '<p class="text-muted">Книг не знайдено.</p>';
    } else {
      container.innerHTML = paginated
        .map((book) => {
          const actionBtn = book.isBorrowed
            ? `<button class="btn btn-warning btn-sm return-btn" data-id="${book.id}">Повернути</button>`
            : `<button class="btn btn-primary btn-sm borrow-btn" data-id="${book.id}">Позичити</button>`;

          return `
          <div class="d-flex justify-content-between align-items-center border-bottom py-2">
            <div>
              <strong>${book.title}</strong> by ${book.author} (${book.year})
            </div>
            <div class="d-flex gap-2">
              ${actionBtn}
              <button class="btn btn-outline-danger btn-sm delete-book-btn" data-id="${book.id}">Видалити</button>
            </div>
          </div>
        `;
        })
        .join('');
    }

    this.renderPagination(
      'book-pagination',
      totalPages,
      this.currentBookPage,
      (p) => {
        this.currentBookPage = p;
        this.renderBooks();
      }
    );

    container.querySelectorAll('.borrow-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = (e.target as HTMLElement).getAttribute('data-id');
        if (id) this.handleBorrowBook(id);
      });
    });

    container.querySelectorAll('.return-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = (e.target as HTMLElement).getAttribute('data-id');
        if (id) this.handleReturnBook(id);
      });
    });

    container.querySelectorAll('.delete-book-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = (e.target as HTMLElement).getAttribute('data-id');
        if (id) {
          this.bookLibrary.remove(id);
          this.saveData();
          this.updateLists();
        }
      });
    });
  }

  private handleBorrowBook(bookId: string): void {
    const book = this.bookLibrary.findById(bookId);
    if (!book) return;

    Modal.prompt(
      'Введіть ID користувача для позичення книги:',
      'ID користувача',
      (userId) => {
        const user = this.userLibrary.findById(userId);
        if (!user) {
          Modal.show('Помилка', `Користувача з ID ${userId} не знайдено!`);
          return;
        }

        if (!user.canBorrow()) {
          Modal.show(
            'Обмеження',
            `Користувач ${user.name} вже позичив максимально можливу кількість книг (3)!`
          );
          return;
        }

        book.borrow(user.id);
        user.addBook(book.id);
        this.saveData();
        this.updateLists();

        Modal.show(
          'Успішно',
          `${book.title} by ${book.author} (${book.year}) has been borrowed by ${user.id} ${user.name} (${user.email}).`
        );
      }
    );
  }

  private handleReturnBook(bookId: string): void {
    const book = this.bookLibrary.findById(bookId);
    if (!book) return;

    if (book.borrowedBy) {
      const user = this.userLibrary.findById(book.borrowedBy);
      if (user) {
        user.removeBook(book.id);
      }
    }

    book.returnBook();
    this.saveData();
    this.updateLists();

    Modal.show(
      'Повернення',
      `${book.title} by ${book.author} (${book.year}) has been returned.`,
      'Закрити'
    );
  }

  private renderUsers(): void {
    const container = document.getElementById('user-list-container');
    if (!container) return;

    const users = this.userLibrary.getAll();
    const totalPages = Math.ceil(users.length / this.itemsPerPage) || 1;
    if (this.currentUsersPage > totalPages) this.currentUsersPage = totalPages;

    const startIdx = (this.currentUsersPage - 1) * this.itemsPerPage;
    const paginated = users.slice(startIdx, startIdx + this.itemsPerPage);

    if (paginated.length === 0) {
      container.innerHTML = '<p class="text-muted">Користувачів немає.</p>';
    } else {
      container.innerHTML = paginated
        .map(
          (user) => `
        <div class="d-flex justify-content-between align-items-center border-bottom py-2">
          <div>
            <strong>${user.id}</strong> ${user.name} (${user.email}) [Позичено книг: ${user.borrowedBookIds.length}/3]
          </div>
          <button class="btn btn-outline-danger btn-sm delete-user-btn" data-id="${user.id}">Видалити</button>
        </div>
      `
        )
        .join('');
    }

    this.renderPagination(
      'user-pagination',
      totalPages,
      this.currentUsersPage,
      (p) => {
        this.currentUsersPage = p;
        this.renderUsers();
      }
    );

    container.querySelectorAll('.delete-user-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = (e.target as HTMLElement).getAttribute('data-id');
        if (id) {
          this.userLibrary.remove(id);
          this.saveData();
          this.updateLists();
        }
      });
    });
  }

  private renderPagination(
    containerId: string,
    totalPages: number,
    currentPage: number,
    onPageChange: (page: number) => void
  ): void {
    const container = document.getElementById(containerId);
    if (!container || totalPages <= 1) {
      if (container) container.innerHTML = '';
      return;
    }

    let buttons = '';
    for (let i = 1; i <= totalPages; i++) {
      const activeClass = i === currentPage ? 'btn-primary' : 'btn-outline-primary';
      buttons += `<button class="btn ${activeClass} btn-sm page-btn" data-page="${i}">${i}</button>`;
    }

    container.innerHTML = buttons;
    container.querySelectorAll('.page-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const page = parseInt(
          (e.target as HTMLElement).getAttribute('data-page') || '1',
          10
        );
        onPageChange(page);
      });
    });
  }
}