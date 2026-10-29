@smoke @regression
Feature: Quote no EDP intersection - file upload

  Scenario: Site outside EDP coverage shows the no-EDP information page for upload journey
    Given I am on the start page
    When I start a new quote
    And I select "I want a quote for the nature restoration levy" as what I would like to do
    And I select "Full planning permission" as my planning type
    And I confirm I am developing housing
    And I enter "10" units
    And I select "Upload a file" as my boundary type
    And I upload "test/fixtures/no_edp_intersection.geojson" as my boundary file
    Then I should see the "Nature restoration levy is not available in this area" heading
    And I should see the no-EDP explanation text
