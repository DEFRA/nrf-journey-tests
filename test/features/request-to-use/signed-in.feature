@regression
Feature: Request to use journey when already signed in with Defra ID

  Scenario: Signed-in employee skips the question about who they are requesting for
    Given I am signed in to Defra ID as an employee
    And I have created a quote for Nature Restoration Levy

    And I am on the review and amend quote details page for my quote
    And I note the number of housing units
    When I continue
    Then I should see the levy amounts for my number of housing units
    When I accept the levy amount
    And I say the development is not an amendment
    Then I should be signed in and can enter my address
    And I should see that I am representing my organisation as an employee
