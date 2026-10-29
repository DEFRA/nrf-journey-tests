@regression
Feature: Request to use journey

  Scenario: Housing developer completes request to use journey
    Given I have a Defra ID account as an employee
    And I have created a quote for Nature Restoration Levy

    When I follow the request to use link in the quote email
    Then I should see the "Enter your NRL reference" heading
    And the NRL reference from my quote is pre-filled
    Then I should see the "Enter your email address" heading
    When I enter "nrfjourneytests@gmail.com" as my email
    Then I should see the email confirmation page
    And I have been sent the retrieve quote email
    When I follow the magic link in the email
    Then I should see the review and amend quote details page
    And I note the number of housing units
    When I continue
    Then I should see the levy amounts for my number of housing units
    When I accept the levy amount
    And I request to use the levy for "The business or organisation you work for"
    And I continue from the "You'll need to create or join a Defra account for your business or organisation" page
    And I sign in to Defra ID
    Then I should be signed in and can enter my address
    And I should see that I am representing my organisation as an employee

  Scenario: Individual completes request to use journey
    Given I have a Defra ID account as an individual
    And I have created a quote for Nature Restoration Levy

    When I follow the request to use link in the quote email
    Then I should see the "Enter your NRL reference" heading
    And the NRL reference from my quote is pre-filled
    Then I should see the "Enter your email address" heading
    When I enter "nrfjourneytests@gmail.com" as my email
    Then I should see the email confirmation page
    And I have been sent the retrieve quote email
    When I follow the magic link in the email
    Then I should see the review and amend quote details page
    And I note the number of housing units
    When I continue
    Then I should see the levy amounts for my number of housing units
    When I accept the levy amount
    And I request to use the levy for "Yourself, as an individual"
    And I continue from the "You'll need to create or sign in to a Defra account as an individual" page
    And I sign in to Defra ID
    Then I should be signed in and can enter my address

  Scenario: Agent completes request to use journey
    Given I have a Defra ID account as an agent
    And I have created a quote for Nature Restoration Levy

    When I follow the request to use link in the quote email
    Then I should see the "Enter your NRL reference" heading
    And the NRL reference from my quote is pre-filled
    Then I should see the "Enter your email address" heading
    When I enter "nrfjourneytests@gmail.com" as my email
    Then I should see the email confirmation page
    And I have been sent the retrieve quote email
    When I follow the magic link in the email
    Then I should see the review and amend quote details page
    And I note the number of housing units
    When I continue
    Then I should see the levy amounts for my number of housing units
    When I accept the levy amount
    And I request to use the levy for "A client you act for as an agent or third party"
    And I continue from the "Your client will need to create a Defra account and invite you as an agent or third party" page
    And I sign in to Defra ID
    Then I should be signed in and can enter my address
    And I should see that I am representing my organisation as an agent
