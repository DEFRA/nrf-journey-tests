@regression
Feature: Request to use dropout pages

  Scenario: Email that does not match the quote shows the details do not match page, and back returns to the email page
    Given I am on the start page
    When I start a new quote
    And I select "I am ready to request to use the nature restoration levy" as what I would like to do
    And I answer "Yes" to having an NRL reference
    Then I should see the "Enter your NRL reference" heading
    When I enter "NRL-000001" as my NRL reference
    Then I should see the "Enter your email address" heading
    When I enter "unknown@example.com" as my email
    Then I should see the "These details do not match our records" heading
    When I click the back link
    Then I should see the "Enter your email address" heading
