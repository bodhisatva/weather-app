beforeEach(() => {
  cy.visit('http://localhost:3000', {
    onBeforeLoad({ navigator }) {
      cy.stub(navigator.geolocation, 'getCurrentPosition').callsFake((callback) => {
        return callback({ coords: { latitude: 60.1754572, longitude: 24.7808413 } })
      })
    }
  })
})

describe('Weather', () => {
  it('should have a user location and current temperature for the location', () => {
    cy.dataCy('current-location').should(($el) => {
      expect($el).not.to.contain.text('Loading...')
      expect($el).to.contain.text('Espoo, FI')
    })
    cy.dataCy('current-temperature').should('be.visible')
    cy.dataCy('current-city').should('be.visible').and('contain.text', 'Espoo')
  })

  it('should show forecast for a selected city', () => {
    const city = 'Helsinki'

    cy.get("[type='text']").type(city).type('{enter}')

    cy.dataCy('forecast').should('be.visible')
    cy.dataCy('current-city').should('be.visible').and('contain.text', city)
  })

  it('should show forecast for five days', () => {
    cy.get("[type='text']").type('Muurame').type('{enter}')

    cy.dataCy('forecast').should('be.visible')
    cy.dataCy('forecast-day').should('have.length', 5)
  })
})
