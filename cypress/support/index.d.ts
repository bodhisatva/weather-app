// /cypress/support/index.d.ts
/// <reference  types="cypress" />
import './commands'

declare global {
  namespace Cypress {
    interface Chainable {
      dataCy(value: string): Chainable<Element>
    }
  }
}
