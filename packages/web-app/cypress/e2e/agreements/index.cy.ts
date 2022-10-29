describe('Agreements', () => {

  it('should load the agreements page', () => {
    cy.visit('/agreements')
    cy.get('body').find('#agreementsPage')
  })
})

export {}
