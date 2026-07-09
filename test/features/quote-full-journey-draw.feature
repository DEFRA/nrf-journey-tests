@smoke @regression
Feature: NRF Quote full journey (drawn boundary on map)

  @smoke @regression
  Scenario: Complete full quote journey via drawn boundary
    Given I am on the start page
    When I reject analytics cookies
    And I start a new quote
    And I select "Full planning permission" as my planning type
    And I continue
    And I confirm I am developing housing
    And I continue
    And I enter "10" residential units
    And I continue
    And I select "Draw on a map" as my boundary type
    And I continue
    And I draw a boundary on the map
    And I enter "nrfjourneytests@gmail.com" as my email
    And I continue
    Then I should see "Drawn" as the red line boundary on the Check Your Answers page
    Then I should see my responses on the Check Your Answers page
    When I submit my answers
    Then I should see the confirmation page
    And I should see an NRF reference number
    And I have been sent a confirmation email
    When I navigate back in the browser
    Then I should be on the start page
