import assert from 'assert'

describe('Image Registration', () => {
  describe('Submitting an image with invalid inputs', () => {
    after(() => {
      cy.clearAllLocalStorage()
    })

    it('Given I am on the image registration page', () => {
      cy.visit('/');
    });

    it(`When I enter "" in the title field`, () => {
      cy.get('#title').type('{enter}')
    });

    it(`Then I enter "" in the URL field`, () => {
      cy.get('#imageUrl').type('{enter}')
    });

    it(`Then I click the submit button`, () => {
      cy.get('#btnSubmit').click()
    });

    it(`Then I should see "Please type a title for the image" message above the title field`, () => {
      cy.get('#titleFeedback').should('contains.text', 'Please type a title for the image')
    });

    it(`And I should see "Please type a valid URL" message above the imageUrl field`, () => {
      cy.get('#urlFeedback').should('contains.text', 'Please type a valid URL')
    });

    it(`And I should see an exclamation icon in the title and URL fields`, () => {
      cy.get('#title').should(([item]) => {
        const borderColor = window.getComputedStyle(item).getPropertyValue('border-right-color')
        assert.strictEqual(borderColor, 'rgb(220, 53, 69)')
      });
    });
  });

  describe('Scenario: Submitting an image with valid inputs using enter key', () => {
    after(() => {
      cy.clearLocalStorage()
    });

    const inputs = {
      title: 'Alien BR',
      imageUrl: 'https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg'
    }

    it('Given I am on the image registration page', () => {
      cy.visit('/');
    });

    it('When I enter "Alien BR" in the title field', () => {
      cy.get("#title").type(inputs.title);
    });

    it('When I enter "https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg" in the URL field', () => {
      cy.get("#imageUrl").type(inputs.imageUrl);
    });

    it('Then I can hit enter to submit the form', () => {
      cy.focused().type('{enter}');
    });

    it('And the list of registered images should be updated with the new item', () => {
      cy.get('#card-list .card-img').last().invoke('attr', 'src').should('equal', inputs.imageUrl);
    });

    it('And the new item should be stored in the localStorage', () => {
      cy.wait(1000)
      cy.getAllLocalStorage().should((storage) => {
        const localStorage = storage[window.location.origin]

        const item = JSON.parse(Object.values(localStorage))[0]

        assert.deepStrictEqual(item, {
          title: inputs.title,
          imageUrl: inputs.imageUrl,
        })
      });
    });

    it('Then The inputs should be cleared', () => {
      cy.get("#title").should('have.value', '');
      cy.get("#imageUrl").should('have.value', '');
    });
  });

  describe("Scenario: Submitting an image and updating the list", () => {
    after(() => {
      cy.clearLocalStorage()
    });

    const inputs = {
      title: "BR Alien",
      imageUrl: "https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg"
    };

    it("Given I am on the image registration page", () => {
      cy.visit('/');
    });

    it("Then I have entered BR Alien in the title field", () => {
      cy.get("#title").type(inputs.title);
    });

    it("Then I have entered https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg in the URL field", () => {
      cy.get("#imageUrl").type(inputs.imageUrl);
    });

    it("When I click the submit button", () => {
      cy.get('#btnSubmit').click();
    });

    it("And the list of registered images should be updated with the new item", () => {
      cy.get('#card-list .card-img').last().invoke('attr', 'src').should('equal', inputs.imageUrl);
    });

    it('And the new item should be stored in the localStorage', () => {
      cy.wait(1000)
      cy.getAllLocalStorage().should((storage) => {
        const localStorage = storage[window.location.origin]

        const item = JSON.parse(Object.values(localStorage))[0]

        assert.deepStrictEqual(item, {
          title: inputs.title,
          imageUrl: inputs.imageUrl,
        })
      });
    });

    it('Then The inputs should be cleared', () => {
      cy.get("#title").should('have.value', '');
      cy.get("#imageUrl").should('have.value', '');
    });
  });

  describe("Scenario: Refreshing the page after submitting an image clicking in the submit button", () => {
    after(() => {
      cy.clearLocalStorage()
    });

    const inputs = {
      title: "BR Alien",
      imageUrl: "https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg"
    };

    it("Given I am on the image registration page", () => {
      cy.visit('/');
    });

    it("Then I have submitted an image by clicking the submit button", () => {
      cy.get("#title").type(inputs.title);
      cy.get("#imageUrl").type(inputs.imageUrl);
      cy.get('#btnSubmit').click();
      cy.wait(1000);
    });

    it("When I refresh the page", () => {
      cy.reload();
    })

    it("Then I should still see the submitted image in the list of registered images", () => {
      cy.get('#card-list .card-img').last().invoke('attr', 'src').should('equal', inputs.imageUrl);
    })
  });
});