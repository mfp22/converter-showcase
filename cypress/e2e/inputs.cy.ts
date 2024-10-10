const sel = (id: string) => `[data-test=${id}]`;

const sourceAmount = sel('cashSource-amount');
const targetAmount = sel('cashTarget-amount');
const exchangeRateForced = sel('exchangeRateForced');
const switchCurrencies = sel('switch');
const saveCurrencies = sel('save');

describe('exchange rate app inputs', () => {
    beforeEach(() => {
        cy.visit('http://localhost:4200');
        localStorage.removeItem('history');
    });

    it('can change currencies, enter source, derive target, save and display card', () => {
        cy.contains('EUR').click();
        cy.contains('AED').click();
        cy.contains('USD').click();
        cy.contains('TWD').click();
        cy.get(sourceAmount).type('5');
        cy.get(switchCurrencies).click();
        cy.get(sourceAmount).should('have.value', '5');
        cy.get(targetAmount).should('have.value', '5.50');
        cy.get(sourceAmount).parent().contains('TWD');
        cy.get(targetAmount).parent().contains('AED');

        cy.get(saveCurrencies).click();
    });

    it('should show source amount as target / exchange rate and target as source * exchange rate', () => {
        cy.get(targetAmount).type('11');
        cy.get(sourceAmount).should('have.value', '10.00');
        cy.get(exchangeRateForced).type('1.11');
        cy.contains('Forced Exchange Rate: 1.11');
        cy.get(targetAmount).should('have.value', '11.10');

        cy.get(saveCurrencies).click();
    });

    it('should show error for extreme forced exchange rate and disable saving', () => {
        cy.get(exchangeRateForced).type('299');
        cy.get(exchangeRateForced).blur();
        cy.contains('ER variation > 2% ER limit!');
        cy.get(saveCurrencies).should('be.disabled');
    });

    it('should show target amount as source * randomly generated exchange rate', () => {
        const getRate = (text: string) => text.match(/Real Exchange Rate: ([\d.]+)/)?.[1];
        cy.contains('Real Exchange Rate:')
            .invoke('text')
            .should(text => {
                const initialRate = getRate(text);
                expect(initialRate).not.to.equal('1.1');
            })
            .then(text => {
                const changedRate = getRate(text);
                cy.get(targetAmount).should('have.attr', 'placeholder', changedRate);
            });
    });
});