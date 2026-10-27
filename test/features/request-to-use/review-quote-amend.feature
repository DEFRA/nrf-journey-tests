@regression
Feature: Change answers on the review and amend quote details page

  Scenario: Change each answer, go back from a change page, and abandon changes
    Given I have created a quote for Nature Restoration Levy

    When I am on the start page
    And I start a new quote
    And I select "I am ready to request to use the nature restoration levy" as what I would like to do
    When I enter my NRL reference
    When I enter "nrfjourneytests@gmail.com" as my email
    Then I should see the email confirmation page
    And I have been sent the retrieve quote email
    When I follow the magic link in the email
    Then I should see the review and amend quote details page

    # Change planning permission type
    When I click Change for "Planning permission type" on the review and amend quote details page
    Then I should be taken to "/request-to-use/change/planning-type"
    When I select "Outline planning permission" as my planning type
    Then I should see the review and amend quote details page
    And I should see "Outline planning permission" for "Planning permission type" on the review and amend quote details page

    # Change number of housing units
    When I click Change for "Number of housing units" on the review and amend quote details page
    Then I should be taken to "/request-to-use/change/unit-number"
    When I enter "25" units
    Then I should see the review and amend quote details page
    And I should see "25" for "Number of housing units" on the review and amend quote details page

    # Confirm the unchanged housing answer
    When I click Change for "Housing" on the review and amend quote details page
    Then I should be taken to "/request-to-use/change/confirm-housing"
    When I confirm I am developing housing
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
