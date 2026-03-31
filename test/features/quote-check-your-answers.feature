@smoke @regression
Feature: Quote check your answers

  @smoke @regression
  Scenario: Summary shows correct rows for a Housing journey
    Given I have completed a "Housing" quote up to check your answers
    Then the "Red line boundary" row should show "Added"
    And the "Development types" row should show "Housing"
    And the "Number of residential units" row should show "10"
    And the "Email address" row should show "test@example.com"

  # TODO: Waste water treatment works page not yet implemented in nrf-frontend.
  # After people count, the frontend currently redirects straight to email.
  # Re-enable once the waste water page is wired into the Other residential journey.
  @pending
  Scenario: Summary shows correct rows for an Other residential journey
    Given I have completed a "Other residential" quote up to check your answers
    Then the "Red line boundary" row should show "Added"
    And the "Development types" row should show "Other residential"
    And the "Maximum number of people" row should show "50"
    And the "Email address" row should show "test@example.com"

  # TODO: same reason as above.
  @pending
  Scenario: Summary shows correct rows for a Housing and Other residential journey
    Given I have completed a "Housing and Other residential" quote up to check your answers
    Then the "Red line boundary" row should show "Added"
    And the "Development types" row should show "Housing"
    And the "Development types" row should show "Other residential"
    And the "Number of residential units" row should show "10"
    And the "Maximum number of people" row should show "50"
    And the "Email address" row should show "test@example.com"

  @regression
  Scenario: Change link for email address navigates to email page with pre-filled value
    Given I have completed a "Housing" quote up to check your answers
    When I click the change link for "Email address"
    Then I should see the "Enter your email address" heading
    And the email field should be pre-filled with "test@example.com"

  @regression
  Scenario: Change link for development types navigates to development types page with pre-filled values
    Given I have completed a "Housing" quote up to check your answers
    When I click the change link for "Development types"
    Then I should see the "What type of development is it?" heading
    And the "Housing" checkbox should be checked

  @regression
  Scenario: Updating email via change link updates the summary
    Given I have completed a "Housing" quote up to check your answers
    When I click the change link for "Email address"
    And I enter "updated@example.com" as my email
    And I continue
    Then the "Email address" row should show "updated@example.com"

  @regression
  Scenario: Summary shows "Added" for a file upload boundary journey
    Given I have uploaded a boundary file and completed a "Housing" quote up to check your answers
    Then the "Red line boundary" row should show "Added"
    And the "Development types" row should show "Housing"
    And the "Number of residential units" row should show "10"
    And the "Email address" row should show "test@example.com"

