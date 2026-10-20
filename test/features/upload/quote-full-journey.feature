@smoke @regression
Feature: NRF Quote full journey (file upload)

  Scenario: Complete full quote and request to use journey via file upload
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
    And I select "Upload a file" as my boundary type
    And I continue
    And I upload "test/fixtures/BnW_small_under_1_hectare.geojson" as my boundary file
    And I save and continue on the boundary preview
    And I enter "nrfjourneytests@gmail.com" as my email
    And I continue
    Then I should see "BnW_small_under_1_hectare.geojson" for "Red line boundary" on the Check Your Answers page
    And I should see my responses on the Check Your Answers page
    When I submit my answers
    Then I should see the confirmation page
    And I should see an NRL reference number
    And I have been sent a confirmation email

    When I follow the request to use link in the quote email
    Then I should see the "Enter your NRL reference" heading
    And the NRL reference from my quote should be pre-filled
    When I continue
    Then I should see the "Enter your email address" heading
    When I enter "nrfjourneytests@gmail.com" as my email
    And I continue
    Then I should see the email confirmation page
    And I have been sent the retrieve quote email
    When I follow the magic link in the email
    Then I should see the review and amend quote details page

    When I follow the magic link in the email
    Then I should see the "This link has expired" heading
    When I get a new link
    Then I should see the email confirmation page
    And I have been sent a new retrieve quote email
    When I follow the magic link in the email
    Then I should see the review and amend quote details page

  Scenario: Request to use dropouts and back links
    Given I am on the start page
    When I start a new quote
    And I select "I am ready to request to use the nature restoration levy" as what I would like to do
    And I continue
    Then I should see the "Do you have an NRL reference?" heading
    When I answer "No" to having an NRL reference
    And I continue
    Then I should see the "You need a quote before you can request to use the nature restoration levy" heading
    When I click the back link
    Then I should see the "Do you have an NRL reference?" heading
    When I answer "Yes" to having an NRL reference
    And I continue
    Then I should see the "Enter your NRL reference" heading
    When I enter "NRL-000001" as my NRL reference
    And I continue
    Then I should see the "Enter your email address" heading
    When I enter "unknown@example.com" as my email
    And I continue
    Then I should see the "These details do not match our records" heading
    When I click the back link
    Then I should see the "Enter your email address" heading
