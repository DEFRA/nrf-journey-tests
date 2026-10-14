@regression
Feature: Request to use journey

  Scenario: Request to use journey asks for the NRL reference when the user has one
    Given I am on the start page
    When I start a new quote
    And I select "I am ready to request to use the nature restoration levy" as what I would like to do
    And I continue
    Then I should see the "Do you have an NRL reference?" heading
    When I answer "Yes" to having an NRL reference
    And I continue
    Then I should see the "Enter your NRL reference" heading
    When I enter "NRL-123456" as my NRL reference
    And I continue
    Then I should see the "Enter your email address" heading
    When I enter "test@example.com" as my email
    And I continue
    Then I should see the "We have sent you an email" heading

  Scenario: Request to use journey asks for the NRL reference when the user doesn't have one
    Given I am on the start page
    When I start a new quote
    And I select "I am ready to request to use the nature restoration levy" as what I would like to do
    And I continue
    Then I should see the "Do you have an NRL reference?" heading
    When I answer "No" to having an NRL reference
    And I continue
    Then I should see the "You need a quote before you can request to use the nature restoration levy" heading
    When I click the back link
    Then I should see the "Do you have an NRL reference?" heading

  Scenario: These details do not match our records page back link returns to enter your email address
    Given I am on the these details do not match our records page
    Then I should see the "These details do not match our records" heading
    When I click the back link
    Then I should see the "Enter your email address" heading
