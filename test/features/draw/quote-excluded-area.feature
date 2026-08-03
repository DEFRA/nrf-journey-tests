@smoke @regression @pending
Feature: Quote excluded area - draw

  Scenario: Excluded area upload shows the excluded area information page
    Given I am on the start page
    When I start a new quote
    And I select "Full planning permission" as my planning type
    And I continue
    And I confirm I am developing housing
    And I continue
    And I enter "10" units
    And I continue
    And I select "Draw on a map" as my boundary type
    And I continue
    And I search the map for "Leeds"
    And I draw a boundary on the map
    And I click Save and continue
    Then I should see the "Development is within the excluded area of this Environmental Delivery Plan (EDP)" heading
