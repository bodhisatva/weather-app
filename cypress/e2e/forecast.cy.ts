beforeEach(() => {
  cy.visit('http://localhost:3000', {
    onBeforeLoad({ navigator }) {
      cy.stub(navigator.geolocation, 'getCurrentPosition').callsFake((callback) => {
        return callback({ coords: { latitude: 60.1754572, longitude: 24.7808413 } })
      })
    }
  })
})

describe('Forecast', () => {
  it('should show forecast for a selected city', () => {
    const city = 'Helsinki'

    cy.get("[type='text']").type(city).type('{enter}', { force: true })

    cy.dataCy('forecast').should('be.visible')
    cy.dataCy('current-city').should('be.visible').and('contain.text', city)
  })

  it('should show forecast for five days', () => {
    cy.get("[type='text']").type('Muurame')
    cy.get('div[class*="option"]').first().click()

    cy.dataCy('forecast').should('be.visible')
    cy.dataCy('forecast-day').should('have.length', 5)
  })

  it('should remove forcast data when user clicks on search combo box', () => {
    cy.get("[type='text']").type('Muurame')
    cy.get('div[class*="option"]').first().click()

    cy.dataCy('forecast').should('be.visible')

    cy.get("[type='text']").click()

    cy.dataCy('forecast').should('not.exist')
  })
})
