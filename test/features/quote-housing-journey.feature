@smoke @regression
Feature: Quote housing journey

  @smoke @regression
  Scenario: Complete Housing quote journey from start to confirmation via file upload
    Given I am on the start page
    When I start a new quote
    And I select "Upload a file" as my boundary type
    And I continue
    And I upload "test/fixtures/BnW_small_under_1_hectare.geojson" as my boundary file
    And I save and continue on the boundary preview
    And I select "Housing"
    And I continue
    And I enter "10" residential units
    And I continue
    Then I should see the "Confirm which waste water treatment works will be used for this development" heading
    And I should see more than 1 waste water treatment works option
    And each waste water treatment works option should show the distance from the development boundary
    And I should see the "I don't know the waste water treatment works yet" option
    When I select "East Rudham WRC" as the waste water treatment works
    And I continue
    And I enter "test@example.com" as my email
    And I continue
    Then I should see the "Check your answers" heading
    When I submit my answers
    Then I should see the confirmation page
    And I should see an NRF reference number
