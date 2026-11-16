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
    When I enter the address details
    Then I should be taken to the review details page
    And I should see "Helen Hanks" for "Full name" on the review details page
    And I should see "Hamblin Housebuilders" for "Business name" on the review details page
    And I should see "1 Development Road" for "Address" on the review details page
    And I should not see a Change link for "Full name" on the review details page
    And I should not see a Change link for "Business name" on the review details page
    When I click Change for "Address" on the review details page
    Then I should be signed in and can enter my address
    When I change the address details
    Then I should see "2 Amended Street" for "Address" on the review details page
    When I confirm the details
    Then I should be taken to "/request-to-use/read-this"
    And I should see the read this page content
    When I continue
    Then I should be taken to "/request-to-use/check-your-answers"

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
    When I enter the address details
    Then I should be taken to the review details page
    And I should see "Chas Chandler" for "Full name" on the review details page
    And I should not see a "Business name" row on the review details page
    And I should see "1 Development Road" for "Address" on the review details page
    And I should not see a Change link for "Full name" on the review details page
    When I click Change for "Address" on the review details page
    Then I should be signed in and can enter my address
    When I enter the address details
    Then I should be taken to the review details page
    When I confirm the details
    Then I should be taken to "/request-to-use/read-this"
    And I should see the read this page content
    When I continue
    Then I should be taken to "/request-to-use/check-your-answers"

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
    When I enter the developer details
    Then I should be taken to the review details page
    And I should see "Trevor Barker" for "Full name" on the review details page
    And I should see "IVY HOUSEBUILDERS LIMITED" for "Business name" on the review details page
    And I should see "1 Development Road" for "Address" on the review details page
    And I should see a Change link for "Full name" on the review details page
    And I should see a Change link for "Business name" on the review details page
    When I click Change for "Full name" on the review details page
    Then I should be signed in and can enter my address
    When I change the developer details
    Then I should see "Amber Barker" for "Full name" on the review details page
    And I should see "2 Amended Street" for "Address" on the review details page
    When I confirm the details
    Then I should be taken to "/request-to-use/read-this"
    And I should see the read this page content
    When I continue
    Then I should be taken to "/request-to-use/check-your-answers"
