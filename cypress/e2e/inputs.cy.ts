/// <reference types="cypress" />

describe('exchange rate app inputs', () => {
    beforeEach(() => {
        cy.visit('http://localhost:4200');
    });

    it('can change source currency to AED', () => {
        cy.contains('EUR').click();
        cy.contains('AED').click();
        cy.contains('EUR').should('not.exist');
        cy.contains('AED').should('exist');
    });

    it('can change target currency to AED', () => {
        cy.contains('USD').click();
        cy.contains('AED').click();
        cy.contains('USD').should('not.exist');
        cy.contains('AED').should('exist');
    });

    const sel = (id: string) => `[data-test=${id}]`;

    const sourceAmount = sel('cashSource-amount');
    const targetAmount = sel('cashTarget-amount');
    const exchangeRateForced = sel('exchangeRateForced');
    const switchCurrencies = sel('switch');

    it('should switch currencies only', () => {
        cy.get(sourceAmount).type('5');
        cy.get(switchCurrencies).click();
        cy.get(sourceAmount).should('have.value', '5');
        cy.get(sourceAmount).parent().contains('USD');
        cy.get(targetAmount).parent().contains('EUR');
    });

    it('should show target amount as source * exchange rate', () => {
        cy.get(sourceAmount).type('100');
        cy.get(targetAmount).should('have.value', '110.00');
    });

    it('should show source amount as target / exchange rate', () => {
        cy.get(targetAmount).type('11');
        cy.get(sourceAmount).should('have.value', '10.00');
    });

    it('should show target amount as source * exchange rate after custom exchange rate', () => {
        cy.get(sourceAmount).type('100');
        cy.get(exchangeRateForced).type('299');
        cy.get(targetAmount).should('have.value', '29900.00');
    });

    it('should show forced exchanged rate', () => {
        cy.get(exchangeRateForced).type('299');
        cy.contains('Forced Exchange Rate: 299');
    });

    it('should show error for extreme forced exchange rate', () => {
        cy.get(exchangeRateForced).type('299');
        cy.get(exchangeRateForced).blur();
        cy.contains('ER variation > 2% ER limit!');
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
