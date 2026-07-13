@smoke @regression
Feature: NRF Quote full journey (file upload)

  @smoke @regression
  Scenario: Complete full quote journey via file upload
    Given I am on the start page
    When I start a new quote
    And I select "Full planning permission" as my planning type
    And I continue
    And I confirm I am developing housing
    And I continue
    And I enter "10" units
    And I continue
    And I select "Upload a file" as my boundary type
    And I continue
    And I upload "test/fixtures/BnW_small_under_1_hectare.geojson" as my boundary file
    And I save and continue on the boundary preview
    And I enter "nrfjourneytests@gmail.com" as my email
    And I continue
    Then I should see "BnW_small_under_1_hectare.geojson" as the red line boundary on the Check Your Answers page
    And I should see my responses on the Check Your Answers page
    When I submit my answers
    Then I should see the confirmation page
    And I should see an NRF reference number
    And I have been sent a confirmation email
