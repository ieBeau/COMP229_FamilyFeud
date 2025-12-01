describe('Signs the user in, and signs the user out', () => {
  it('sign in and sign out', function() {
    cy.visit('http://localhost:5173/')
    cy.get('#root a.landing-basic__cta').click();
    cy.get('#root [name="email"]').click();
    cy.get('#root [name="email"]').type('pmoreau@gmail.com');
    cy.get('#root [name="password"]').type('Password123');
    cy.get('#root button[type="submit"]').click();
    cy.get('#landing-drawer a[href="/profile"]').click();
    cy.get('#landing-drawer button.primary-button').click();
  })
});