describe('Страница конструктора бургера', () => {
  const bunName = 'Булка тестовая';
  const mainName = 'Начинка тестовая';
  const sauceName = 'Соус тестовый';
  const orderNumber = 12345;

  const SEL = {
    modal: '[data-cy="modal"]',
    modalClose: '[data-cy="modal-close"]',
    modalOverlay: '[data-cy="modal-overlay"]'
  };

  const TXT = {
    add: 'Добавить',
    order: 'Оформить заказ',
    chooseBuns: 'Выберите булки',
    chooseFilling: 'Выберите начинку',
    ingredientDetails: 'Детали ингредиента'
  };

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
    cy.contains('li', bunName).within(() => {
      cy.contains('button', TXT.add).click();
    });

    cy.contains(`${bunName} (верх)`).should('exist');
    cy.contains(`${bunName} (низ)`).should('exist');

    cy.contains('li', mainName).within(() => {
      cy.contains('button', TXT.add).click();
    });

    cy.contains(TXT.chooseFilling).should('not.exist');
    cy.contains(mainName).should('exist');
  });

  it('Модалка ингредиента: открытие и закрытие (крестик + оверлей)', () => {
    cy.contains('a', bunName).click();

    cy.location('pathname').should('match', /^\/ingredients\/.+/);

    cy.get(SEL.modal).should('exist');
    cy.get(SEL.modal).contains(TXT.ingredientDetails).should('exist');

    cy.get(SEL.modalClose).click();
    cy.get(SEL.modal).should('not.exist');
    cy.location('pathname').should('eq', '/');

    cy.contains('a', bunName).click();
    cy.get(SEL.modal).should('exist');

    cy.get(SEL.modalOverlay).click({ force: true });
    cy.get(SEL.modal).should('not.exist');
    cy.location('pathname').should('eq', '/');
  });

  it('Создание заказа: моки user + order, токены, проверка номера заказа и очистки конструктора', () => {
    setAuthTokens();

    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('order');

    cy.contains('li', bunName).within(() => {
      cy.contains('button', TXT.add).click();
    });
    cy.contains('li', mainName).within(() => {
      cy.contains('button', TXT.add).click();
    });
    cy.contains('li', sauceName).within(() => {
      cy.contains('button', TXT.add).click();
    });

    cy.contains('button', TXT.order).click();
    cy.wait('@order');

    cy.get(SEL.modal).should('exist');
    cy.get(SEL.modal).contains(String(orderNumber)).should('exist');

    cy.get(SEL.modalClose).click();
    cy.get(SEL.modal).should('not.exist');

    cy.contains(TXT.chooseBuns).should('exist');
    cy.contains(TXT.chooseFilling).should('exist');
  });
});