@regression
Feature: Change the planning application type from Check Your Answers
  Changing the planning application type to Other from Check Your Answers
  shows the dropout page, but the ineligible answer is not saved: backing
  out of the dropout returns to Check Your Answers with the previous
  answer unchanged.

  Background:
    Given I am on the start page
    When I start a new quote
    And I select "I want a quote for the nature restoration levy" as what I would like to do
    And I select "Full planning permission" as my planning type
    And I confirm I am developing housing
    And I enter "10" units
    And I select "Draw on a map" as my boundary type
    And I search the map for "Aylsham"
    And I draw a boundary on the map
    And I click Save and continue
    And I enter "nrfjourneytests@gmail.com" as my email

  Scenario: Back from the planning type dropout returns to Check Your Answers unchanged
    When I click Change for "Planning application type" on the Check Your Answers page
    And I select "Other" as my planning type
    Then I should be taken to "/quote/application-type-not-available"
    And I should see the "Nature restoration levy is not currently available for this planning application type" heading
    When I click the back link
    Then I should see the "What type of planning application are you planning to submit?" heading
    And the "Full planning permission" option should be selected
    When I click the back link
    Then I should see the "Check your answers" heading
    And I should see "Full planning permission" for "Planning application type" on the Check Your Answers page
