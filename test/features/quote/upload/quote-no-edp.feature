@smoke @regression
Feature: Quote no EDP intersection - file upload

  # A site crossing the EDP boundary is half inside the Norfolk EDP and half
  # north of its edge, well clear of any exclusion zone. Any breach of the EDP's
  # outer edge puts the whole site out of the EDP, so it gets the same page as a
  # site entirely outside it.
  Scenario Outline: Site <site> shows the no-EDP information page for upload journey
    Given I am on the start page
    When I start a new quote
    And I select "I want a quote for the nature restoration levy" as what I would like to do
    And I select "Full planning permission" as my planning type
    And I confirm I am developing housing
    And I enter "10" units
    And I select "Upload a file" as my boundary type
    And I upload "<boundary file>" as my boundary file
    Then I should see the "Nature restoration levy is not available in this area" heading
    And I should see the no-EDP explanation text

    Examples:
      | site                      | boundary file                               |
      | outside EDP coverage      | test/fixtures/no_edp_intersection.geojson   |
      | crossing the EDP boundary | test/fixtures/edp_boundary_crossing.geojson |
