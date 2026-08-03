@smoke @regression
Feature: Quote excluded area - upload

  Scenario: Excluded area upload shows the excluded area information page
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
    And I upload "test/fixtures/excluded-area.geojson" as my boundary file
    Then I should see the "Development is within the excluded area of this Environmental Delivery Plan (EDP)" heading
