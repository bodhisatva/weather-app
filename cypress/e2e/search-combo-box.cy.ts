beforeEach(() => {
  cy.visit('http://localhost:3000', {
    onBeforeLoad({ navigator }) {
      cy.stub(navigator.geolocation, 'getCurrentPosition').callsFake((callback) => {
        return callback({ coords: { latitude: 60.1754572, longitude: 24.7808413 } })
      })
    }
  })
})

describe('Search combo box', () => {
  it('should filter exact search result on top of the list', () => {
    const city = 'Lahti'

    cy.get("[type='text']").type(`${city}`)

    cy.get('div[class*="menu"]')
      .find('div[class*="option"]')
      .should('be.visible')
      .and('have.length', 12)

    cy.get('div[class*="option"]').first().should('contain.text', `${city}`)
  })
})
