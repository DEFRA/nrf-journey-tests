@smoke @regression
Feature: NRF Quote full journey (file upload)

  @smoke @regression
  Scenario: Complete full quote journey from start to confirmation via file upload
    Given I am on the start page
    When I start a new quote
    And I select "Upload a file" as my boundary type
    And I continue
    And I upload "test/fixtures/BnW_small_under_1_hectare.geojson" as my boundary file
    And I save and continue on the boundary preview
    And I select "Housing"
    And I select "Other residential"
    And I continue
    And I enter "10" residential units
    And I continue
    And I enter "250" as the maximum number of people
    And I continue
    Then I should see more than 1 waste water treatment works option
    And each waste water treatment works option should show the distance from the development boundary
    When I select the first available waste water treatment works
    And I continue
    And I enter "test@example.com" as my email
    And I continue
    Then I should see my responses on the Check Your Answers page
    When I submit my answers
    Then I should see the confirmation page
    And I should see an NRF reference number
    When I navigate back in the browser
    Then I should be on the start page
