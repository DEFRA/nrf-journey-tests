@smoke @regression
Feature: Quote check your answers

  @smoke @regression
  Scenario: Summary shows correct rows for a Housing journey
    Given I have completed a "Housing" quote up to check your answers
    Then the "Red line boundary" row should show "Added"
    And the "Development types" row should show "Housing"
    And the "Number of residential units" row should show "10"
    And the "Email address" row should show "test@example.com"

  @regression
  Scenario: Summary shows correct rows for an Other residential journey
    Given I have completed a "Other residential" quote up to check your answers
    Then the "Red line boundary" row should show "Added"
    And the "Development types" row should show "Other residential"
    And the "Maximum number of people" row should show "50"
    And the "Email address" row should show "test@example.com"

  @regression
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

  # TODO: Full submission is blocked until the frontend sends boundaryGeojson in the
  # POST /quotes request. The backend requires this field but the frontend does not yet
  # include it. Submission scenarios are already tracked in quote-submission-confirmation.feature.
  @pending
  Scenario: Submitting a quote navigates to the confirmation page
    Given I have completed a "Housing" quote up to check your answers
    When I submit my answers
    Then I should see the confirmation page
    And I should see an NRF reference number

  @regression
  Scenario: Summary shows "Added" for a file upload boundary journey
    Given I have uploaded a boundary file and completed a "Housing" quote up to check your answers
    Then the "Red line boundary" row should show "Added"
    And the "Development types" row should show "Housing"
    And the "Number of residential units" row should show "10"
    And the "Email address" row should show "test@example.com"

  # TODO: Conditional answer clearing is covered by nrf-frontend integration tests.
  # Not duplicated at E2E level.
  @pending
  Scenario: Removing a development type clears the related answer from the summary
    Given I have completed a "Housing and Other residential" quote up to check your answers
    When I click the change link for "Development types"
    And I deselect "Housing"
    And I continue
    Then the "Number of residential units" row should not be shown
