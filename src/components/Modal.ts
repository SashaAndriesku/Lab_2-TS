export class Modal {
  static show(
    title: string,
    bodyText: string,
    confirmText: string = 'Зрозуміло!',
    onConfirm?: () => void
  ): void {
    const existing = document.getElementById('custom-modal');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'custom-modal';
    backdrop.className = 'modal fade show d-block';
    backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

    backdrop.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow">
          <div class="modal-header">
            <h5 class="modal-title fs-5">${title}</h5>
            <button type="button" class="btn-close" id="modal-close-btn"></button>
          </div>
          <div class="modal-body py-4">
            <p class="mb-0">${bodyText}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="modal-confirm-btn">${confirmText}</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    const close = () => backdrop.remove();

    document
      .getElementById('modal-close-btn')
      ?.addEventListener('click', close);
    document
      .getElementById('modal-confirm-btn')
      ?.addEventListener('click', () => {
        close();
        if (onConfirm) onConfirm();
      });
  }

  static prompt(
    title: string,
    placeholder: string,
    onSave: (value: string) => void
  ): void {
    const existing = document.getElementById('custom-modal');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'custom-modal';
    backdrop.className = 'modal fade show d-block';
    backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

    backdrop.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow">
          <div class="modal-header">
            <h5 class="modal-title fs-5">${title}</h5>
            <button type="button" class="btn-close" id="modal-close-btn"></button>
          </div>
          <div class="modal-body py-3">
            <input type="text" id="modal-prompt-input" class="form-control" placeholder="${placeholder}">
            <div id="modal-error" class="text-danger mt-2 small d-none"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="modal-cancel-btn">Скасувати</button>
            <button type="button" class="btn btn-primary" id="modal-save-btn">Зберегти</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    const close = () => backdrop.remove();

    document
      .getElementById('modal-close-btn')
      ?.addEventListener('click', close);
    document
      .getElementById('modal-cancel-btn')
      ?.addEventListener('click', close);

    document.getElementById('modal-save-btn')?.addEventListener('click', () => {
      const input = document.getElementById(
        'modal-prompt-input'
      ) as HTMLInputElement;
      if (input && input.value.trim()) {
        const val = input.value.trim();
        close();
        onSave(val);
      } else {
        const err = document.getElementById('modal-error');
        if (err) {
          err.textContent = 'Це поле є обов’язковим';
          err.classList.remove('d-none');
        }
      }
    });
  }
}