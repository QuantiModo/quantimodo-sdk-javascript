// load type definitions that come with Cypress module
/// <reference types="cypress" />
describe('WordPress', function(){
    it('Clicks pricing page link', function(){
        cy.visit('https://quantimo.do')
        cy.get('a').contains("Pricing").click({force: true})
        cy.get('a').contains("Request Demo").should('exist')
    })
    it('Clicks the Drift chat button', function(){
        cy.visit('https://quantimo.do')
        cy.get('#drift-widget', {timeout: 20000}).click({force: true, multiple: true})
    })
    it('Clicks to email mike', function(){
        cy.visit('https://quantimo.do')
        cy.get('a[href="mailto:mike@quantimo.do"]').should('exist')
    })
    it('Checks the data sources page', function(){
        cy.visit('https://quantimo.do')
        cy.get('a[href*="/data-sources/"]').click({force: true})
        cy.get('#post-18731 > div > div.portfolio-header > h3 > a').click({force: true})
        cy.get('#feature-bullets > ul > li:nth-child(1) > span').should('contain', 'Ultra precise weight')
    })
    it('Clicks the QuantiModo floating action button', function(){
        cy.visit('https://quantimo.do')
        cy.get('#single-floating-action-button').click({force: true, multiple: true})
    })
    it('Checks the privacy policy', function(){
        cy.visit('https://quantimo.do')
        cy.get('a[href*="/privacy-policy/"]').click({force: true})
        cy.getWithinIframe('html').should('contain', 'committed to protecting')
    })
    it('Checks the end user terms of service', function(){
        cy.visit('https://quantimo.do')
        cy.get('a[href*="/end-user-terms-of-service/"]').click({force: true})
        cy.get('html').should('contain', 'End Users authorize')
    })
    it('Checks the data security page', function(){
        cy.visit('https://quantimo.do')
        cy.get('a[href*="/developer-platform/security/"]').click({force: true})
        cy.get('html').should('contain', 'Data Encryption')
    })
})
