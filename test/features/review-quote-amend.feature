@regression
Feature: NRF2-1260 Change answers on the review and amend quote details page

  Scenario: Change each answer, go back from a change page, and abandon changes
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

    # Change planning permission type
    When I click Change for "Planning permission type" on the review and amend quote details page
    Then I should be taken to "/request-to-use/change/planning-type"
    When I select "Outline planning permission" as my planning type
    And I continue
    Then I should see the review and amend quote details page
    And I should see "Outline planning permission" for "Planning permission type" on the review and amend quote details page

    # Change number of housing units
    When I click Change for "Number of housing units" on the review and amend quote details page
    Then I should be taken to "/request-to-use/change/unit-number"
    When I enter "25" units
    And I continue
    Then I should see the review and amend quote details page
    And I should see "25" for "Number of housing units" on the review and amend quote details page

    # Confirm the unchanged housing answer
    When I click Change for "Housing" on the review and amend quote details page
    Then I should be taken to "/request-to-use/change/confirm-housing"
    When I confirm I am developing housing
    And I continue
    Then I should see the review and amend quote details page
    And I should see "Yes" for "Housing" on the review and amend quote details page

    # Back from a change page returns to the review page with the answers intact
    When I click Change for "Number of housing units" on the review and amend quote details page
    And I click the back link
    Then I should see the review and amend quote details page
    And I should see "25" for "Number of housing units" on the review and amend quote details page

    # Leaving without continuing loses the changes: a fresh link shows the original answers
    When I follow the magic link in the email
    Then I should see the "This link has expired" heading
    When I get a new link
    Then I should see the email confirmation page
    And I have been sent a new retrieve quote email
    When I follow the magic link in the email
    Then I should see the review and amend quote details page
    And I should see "Full planning permission" for "Planning permission type" on the review and amend quote details page
    And I should see "10" for "Number of housing units" on the review and amend quote details page
