describe('Страница конструктора бургера', () => {
  const bunName = 'Булка тестовая';
  const mainName = 'Начинка тестовая';
  const sauceName = 'Соус тестовый';

  const orderNumber = 12345;

  const interceptCommon = () => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('ingredients');
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('user');
  };

  const setAuthTokens = () => {
    cy.setCookie('accessToken', 'test-access-token');
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'test-refresh-token');
    });
  };

  beforeEach(() => {
    interceptCommon();
    cy.visit('/');
    cy.wait('@ingredients');
    cy.wait('@user');
  });

  it('Добавление ингредиентов в конструктор: булка и начинка', () => {
    // Добавляем булку
    cy.contains('li', bunName).within(() => {
      cy.contains('button', 'Добавить').click();
    });

    // Проверяем, что булка появилась сверху и снизу
    cy.contains(`${bunName} (верх)`).should('exist');
    cy.contains(`${bunName} (низ)`).should('exist');

    // Добавляем начинку
    cy.contains('li', mainName).within(() => {
      cy.contains('button', 'Добавить').click();
    });

    // Плейсхолдер "Выберите начинку" должен исчезнуть
    cy.contains('Выберите начинку').should('not.exist');

    // И имя начинки должно где-то появиться в конструкторе
    cy.contains(mainName).should('exist');
  });

  it('Модалка ингредиента: открытие и закрытие (крестик + оверлей)', () => {
    // Открываем модалку по клику на ссылку ингредиента (Link)
    cy.contains('a', bunName).click();

    // URL должен стать /ingredients/:id
    cy.location('pathname').should('match', /^\/ingredients\/.+/);

    // Модалка должна появиться (portal в #modals, но мы цепляемся по data-cy)
    cy.get('[data-cy="modal"]').should('exist');
    cy.get('[data-cy="modal"]').contains('Детали ингредиента').should('exist');

    // Закрываем по крестику
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
    cy.location('pathname').should('eq', '/');

    // Открываем снова
    cy.contains('a', bunName).click();
    cy.get('[data-cy="modal"]').should('exist');

    // Закрываем по оверлею
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
    cy.location('pathname').should('eq', '/');
  });

  it('Создание заказа: моки user + order, токены, проверка номера заказа и очистки конструктора', () => {
    // Для заказа нужны токены
    setAuthTokens();

    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('order');

    // Собираем бургер: булка + начинка + соус
    cy.contains('li', bunName).within(() => {
      cy.contains('button', 'Добавить').click();
    });
    cy.contains('li', mainName).within(() => {
      cy.contains('button', 'Добавить').click();
    });
    cy.contains('li', sauceName).within(() => {
      cy.contains('button', 'Добавить').click();
    });

    // Нажимаем "Оформить заказ"
    cy.contains('button', 'Оформить заказ').click();

    cy.wait('@order');

    // Должна открыться модалка заказа с корректным номером
    cy.get('[data-cy="modal"]').should('exist');
    cy.get('[data-cy="modal"]').contains(String(orderNumber)).should('exist');

    // Закрываем модалку
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');

    // Проверяем, что конструктор пуст
    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });
});