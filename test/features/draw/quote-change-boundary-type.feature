@regression
Feature: Change a red line boundary from Check Your Answers
  The Change link opens the boundary type page first, so the user can switch
  between drawing and uploading, and a saved boundary change returns to Check
  Your Answers instead of continuing to the email page.

  Background:
    Given I am on the start page
    When I start a new quote
    And I select "I want a quote for the nature restoration levy" as what I would like to do
    And I continue
    And I select "Full planning permission" as my planning type
    And I continue
    And I confirm I am developing housing
    And I continue
    And I enter "10" units
    And I continue
    And I select "Draw on a map" as my boundary type
    And I continue
    And I search the map for "Aylsham"
    And I draw a boundary on the map
    And I click Save and continue
    And I enter "nrfjourneytests@gmail.com" as my email
    And I continue

  Scenario: The drawn boundary Change link opens the boundary type page
    When I click Change for "Red line boundary" on the Check Your Answers page
    Then I should see the "Choose how you would like to show us the boundary of your development" heading
    And the "Draw on a map" option should be selected
    When I click the back link
    Then I should see the "Check your answers" heading

  Scenario: Continuing with Draw returns to the map with the existing boundary
    When I click Change for "Red line boundary" on the Check Your Answers page
    And I continue
    Then I should see the "Draw your boundary on a map" heading
    And the map should show my previously drawn boundary
    When I click the back button on the map
    Then I should see the "Choose how you would like to show us the boundary of your development" heading

  Scenario: Saving an unchanged drawn boundary returns to the Check Your Answers page
    When I click Change for "Red line boundary" on the Check Your Answers page
    And I continue
    And I click Save and continue
    Then I should see the "Check your answers" heading
    And I should see "Added" for "Red line boundary" on the Check Your Answers page

  Scenario: Saving an amended drawn boundary returns to the Check Your Answers page
    When I click Change for "Red line boundary" on the Check Your Answers page
    And I continue
    And I amend the boundary on the map
    And I click Save and continue
    Then I should see the "Check your answers" heading
    And I should see "Added" for "Red line boundary" on the Check Your Answers page

  Scenario: Switching to upload from the boundary type page
    When I click Change for "Red line boundary" on the Check Your Answers page
    And I select "Upload a file" as my boundary type
    And I continue
    Then I should see the "Upload a red line boundary file" heading

  Scenario: Saving an uploaded boundary returns to the Check Your Answers page
    When I click Change for "Red line boundary" on the Check Your Answers page
    And I select "Upload a file" as my boundary type
    And I continue
    And I upload "test/fixtures/BnW_small_under_1_hectare.geojson" as my boundary file
    And I save and continue on the boundary preview
    Then I should see the "Check your answers" heading
    And I should see "BnW_small_under_1_hectare.geojson" for "Red line boundary" on the Check Your Answers page

  Scenario: Back from the uploaded file page returns to the upload page, boundary type page and Check Your Answers page
    When I click Change for "Red line boundary" on the Check Your Answers page
    And I select "Upload a file" as my boundary type
    And I continue
    And I upload "test/fixtures/BnW_small_under_1_hectare.geojson" as my boundary file
    When I click the back link
    Then I should see the "Upload a red line boundary file" heading
    When I click the back link
    Then I should see the "Choose how you would like to show us the boundary of your development" heading
    When I click the back link
    Then I should see the "Check your answers" heading

  Scenario: Back from a dropout page returns to the upload page, boundary type page and Check Your Answers page
    When I click Change for "Red line boundary" on the Check Your Answers page
    And I select "Upload a file" as my boundary type
    And I continue
    And I upload "test/fixtures/no_edp_intersection.geojson" as my boundary file
    Then I should see the "Nature restoration levy is not available in this area" heading
    When I click the back link
    Then I should see the "Upload a red line boundary file" heading
    When I click the back link
    Then I should see the "Choose how you would like to show us the boundary of your development" heading
    When I click the back link
    Then I should see the "Check your answers" heading
