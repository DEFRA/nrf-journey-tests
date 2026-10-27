@regression
Feature: Change answers on the review and amend quote details page

  Scenario: Request to use dropouts and back links
    Given I am on the start page
    When I start a new quote
    And I select "I am ready to request to use the nature restoration levy" as what I would like to do
    Then I should see the "Do you have an NRL reference?" heading
    When I answer "No" to having an NRL reference
    Then I should see the "You need a quote before you can request to use the nature restoration levy" heading
    When I click the back link
    Then I should see the "Do you have an NRL reference?" heading
    When I answer "Yes" to having an NRL reference
    Then I should see the "Enter your NRL reference" heading
    When I enter "NRL-000001" as my NRL reference
    Then I should see the "Enter your email address" heading
    When I enter "unknown@example.com" as my email
    Then I should see the "These details do not match our records" heading
    When I click the back link
    Then I should see the "Enter your email address" heading
