@regression
Feature: Request to use journey when already signed in with Defra ID

  Scenario: Signed-in employee skips the question about who they are requesting for
    Given I am signed in to Defra ID as an employee
    And I have created a quote for Nature Restoration Levy

    When I follow the request to use link in the quote email
    Then I should see the "Enter your NRL reference" heading
    And the NRL reference from my quote is pre-filled
    Then I should see the "Enter your email address" heading
    When I enter "nrfjourneytests@gmail.com" as my email
    Then I should see the email confirmation page
    And I have been sent the retrieve quote email
    When I follow the magic link in the email
    Then I should see the review and amend quote details page
    And I note the number of housing units
    When I continue
    Then I should see the levy amounts for my number of housing units
    When I accept the levy amount
    Then I should be signed in and can enter my address
    And I should see that I am representing my organisation as an employee
