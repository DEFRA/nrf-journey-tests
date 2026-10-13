@regression
Feature: Request to use journey

  Scenario: Request to use journey starts with the NRL reference question
    Given I am on the start page
    When I start a new quote
    And I select "I am ready to request to use the nature restoration levy" as what I would like to do
    And I continue
    Then I should see the "Do you have an NRL reference?" heading
    When I select "No" as whether I have an NRL reference
    And I continue
    Then I should see the "You need a quote before you can request to use the nature restoration levy" heading
    When I click the back link
    Then I should see the "Do you have an NRL reference?" heading
