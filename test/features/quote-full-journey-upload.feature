@smoke @regression
Feature: NRF Quote full journey (file upload)

  @smoke @regression
  Scenario: Complete full quote journey via file upload
    Given I am on the start page
    When I start a new quote
    And I select "Full planning permission" as my planning type
    And I continue
    And I select "Upload a file" as my boundary type
    And I continue
    And I upload "test/fixtures/BnW_small_under_1_hectare.geojson" as my boundary file
    And I save and continue on the boundary preview
    And I select "Housing"
    And I select "Other residential"
    And I continue
    And I enter "10" residential units
    And I continue
    And I enter "250" as the maximum number of people
    And I continue
    And I enter "nrfjourneytests@gmail.com" as my email
    And I continue
    Then I should see "BnW_small_under_1_hectare.geojson" as the red line boundary on the Check Your Answers page
    And I should see my responses on the Check Your Answers page
    When I submit my answers
    Then I should see the confirmation page
    And I should see an NRF reference number
    And I have been sent a confirmation email
    When I follow the quote link in the email
    Then I should see the quote details page with my NRF reference
    When I open the quote link in 5 fresh sessions
    Then I should see that the link is invalid
    When I enter my email to receive a new link
    Then I should see that a new link has been sent
    And I should receive a new quote link by email
