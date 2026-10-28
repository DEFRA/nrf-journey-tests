@smoke @regression
Feature: Quote excluded area - draw

  Scenario: Excluded area draw journey shows the excluded area information page
    Given I am on the start page
    When I start a new quote
    And I select "I want a quote for the nature restoration levy" as what I would like to do
    And I select "Full planning permission" as my planning type
    And I confirm I am developing housing
    And I enter "10" units
    And I select "Draw on a map" as my boundary type
    And I search the map for "Coldham Hall Carnser, NR14, Norfolk"
    And I draw a boundary on the map
    And I should see the unsupported area message in the boundary information panel
    When I click Save and continue
    Then I should see the "Development is within the excluded area of this Environmental Delivery Plan (EDP)" heading
