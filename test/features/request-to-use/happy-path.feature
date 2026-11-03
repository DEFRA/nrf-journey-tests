@regression
Feature: Request to use journey

  Scenario: Housing developer completes request to use journey
    Given I have a Defra ID account as an employee
    And I have created a quote for Nature Restoration Levy

    And I am on the review and amend quote details page for my quote
    And I note the number of housing units
    When I continue
    Then I should see the levy amounts for my number of housing units
    When I accept the levy amount
    And I say the development is not an amendment
    And I request to use the levy for "The business or organisation you work for"
    And I continue from the "You'll need to create or join a Defra account for your business or organisation" page
    And I sign in to Defra ID
    Then I should be signed in and can enter my address
    And I should see that I am representing my organisation as an employee

  Scenario: Individual completes request to use journey
    Given I have a Defra ID account as an individual
    And I have created a quote for Nature Restoration Levy

    And I am on the review and amend quote details page for my quote
    And I note the number of housing units
    When I continue
    Then I should see the levy amounts for my number of housing units
    When I accept the levy amount
    And I say the development is not an amendment
    And I request to use the levy for "Yourself, as an individual"
    And I continue from the "You'll need to create or sign in to a Defra account as an individual" page
    And I sign in to Defra ID
    Then I should be signed in and can enter my address

  Scenario: Agent completes request to use journey
    Given I have a Defra ID account as an agent
    And I have created a quote for Nature Restoration Levy

    And I am on the review and amend quote details page for my quote
    And I note the number of housing units
    When I continue
    Then I should see the levy amounts for my number of housing units
    When I accept the levy amount
    And I say the development is not an amendment
    And I request to use the levy for "A client you act for as an agent or third party"
    And I continue from the "Your client will need to create a Defra account and invite you as an agent or third party" page
    And I sign in to Defra ID and am shown the organisation picker
    And I choose "IVY HOUSEBUILDERS LIMITED" on the organisation picker
    Then I should be signed in and can enter my address
    And I should see that I am representing my organisation as an agent
