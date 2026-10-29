@smoke @regression
Feature: Quote excluded area - upload

  Scenario: Excluded area upload journey shows the excluded area information page
    Given I am on the start page
    When I start a new quote
    And I select "I want a quote for the nature restoration levy" as what I would like to do
    And I select "Full planning permission" as my planning type
    And I confirm I am developing housing
    And I enter "10" units
    And I select "Upload a file" as my boundary type
    And I upload "test/fixtures/excluded_area.geojson" as my boundary file
    Then I should see the "Development is within the excluded area of this Environmental Delivery Plan (EDP)" heading
