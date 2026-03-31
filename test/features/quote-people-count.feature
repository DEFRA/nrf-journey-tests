Feature: Other residential - people count

  # TODO: Waste water treatment works page not yet implemented in nrf-frontend.
  # After people count, the frontend currently redirects straight to email.
  # Re-enable once the waste water page is wired into the journey.
  @pending
  Scenario: Developer navigates from people count to email for an Other residential development
    Given I am on the development types page
    When I select "Other residential"
    And I continue
    And I enter "250" as the maximum number of people
    And I continue
    And I select "I don't know the waste water treatment works yet" as the waste water treatment works
    And I continue
    Then I should be on the email page
