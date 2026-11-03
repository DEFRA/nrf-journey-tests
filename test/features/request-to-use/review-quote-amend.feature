@regression
Feature: Change answers on the review and amend quote details page

  Scenario: A changed answer is shown on the review page and lost when the user leaves without continuing
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

    When I click Change for "Planning permission type" on the review and amend quote details page
    Then I should be taken to "/request-to-use/change/planning-type"
    When I select "Outline planning permission" as my planning type
    Then I should see the review and amend quote details page
    And I should see "Outline planning permission" for "Planning permission type" on the review and amend quote details page

    # Leaving without continuing loses the changes: a fresh link shows the original answers
    When I follow the magic link in the email
    Then I should see the "This link has expired" heading
    When I get a new link
    Then I should see the email confirmation page
    And I have been sent a new retrieve quote email
    When I follow the magic link in the email
    Then I should see the review and amend quote details page
    And I should see "Full planning permission" for "Planning permission type" on the review and amend quote details page
