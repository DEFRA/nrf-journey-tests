@regression
Feature: Request to use journey

  Scenario: Request to use journey starts with the NRL reference question
    Given I am on the start page
    When I start a new quote
    And I select "I am ready to request to use the nature restoration levy" as what I would like to do
    And I continue
    Then I should see the "Do you have an NRL reference?" heading
