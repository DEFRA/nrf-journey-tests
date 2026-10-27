@regression
Feature: Change a drawn red line boundary from Check Your Answers
  The drawn-boundary Change link opens the boundary type page first, so the
  user can switch between drawing and uploading before re-entering the
  boundary sub-journey.

  Background:
    Given I am on the start page
    When I start a new quote
    And I select "I want a quote for the nature restoration levy" as what I would like to do
    And I select "Full planning permission" as my planning type
    And I confirm I am developing housing
    And I enter "10" units
    And I select "Draw on a map" as my boundary type
    And I search the map for "Aylsham"
    And I draw a boundary on the map
    And I click Save and continue
    And I enter "nrfjourneytests@gmail.com" as my email

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

  Scenario: Amending the boundary continues to the email page
    When I click Change for "Red line boundary" on the Check Your Answers page
    And I continue
    And I amend the boundary on the map
    And I click Save and continue
    Then I should see the "Enter your email address" heading

  Scenario: Switching to upload from the boundary type page
    When I click Change for "Red line boundary" on the Check Your Answers page
    And I select "Upload a file" as my boundary type
    Then I should see the "Upload a red line boundary file" heading
