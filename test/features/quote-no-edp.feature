@smoke @regression
Feature: Quote no EDP intersection

  @smoke @regression
  Scenario: Site outside EDP coverage shows the no-EDP information page
    Given I am on the start page
    When I start a new quote
    And I select "Upload a file" as my boundary type
    And I continue
    And I upload "test/fixtures/no_edp_intersection.geojson" as my boundary file
    And I save and continue on the boundary preview
    Then I should see the "Nature Restoration Fund levy is not available in this area" heading
    And I should see the no-EDP explanation text
