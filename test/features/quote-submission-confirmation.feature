@smoke @regression
Feature: Quote submission confirmation

  # TODO: Submission and confirmation steps are blocked until the frontend sends boundaryGeojson.
  # The backend now requires boundaryGeojson in POST /quotes but the frontend does not yet
  # include it (map drawing / file upload boundary flow not yet wired to the quote submission).
  # Re-enable the commented steps once the frontend sends boundaryGeojson.
  # TODO: pending until nrf-frontend waste-water page is merged and published
  @pending
  Scenario: Developer submits a quote for a Housing development
    Given I am on the development types page
    When I select "Housing"
    And I continue
    And I enter "10" residential units
    And I continue
    And I select "I don't know the waste water treatment works yet" as the waste water treatment works
    And I continue
    And I enter "test@example.com" as my email
    And I continue
    Then I should see the "Check your answers" heading
    # And I submit my answers
    # Then I should see the confirmation page
    # And I should see an NRF reference number
    # And I should see the "What happens next" section
    # And I should see a message that I will receive an email

  # TODO: pending until nrf-frontend waste-water page is merged and published
  @pending
  Scenario: Developer submits a quote for an Other residential development
    Given I am on the development types page
    When I select "Other residential"
    And I continue
    And I enter "50" as the maximum number of people
    And I continue
    And I select "I don't know the waste water treatment works yet" as the waste water treatment works
    And I continue
    And I enter "test@example.com" as my email
    And I continue
    Then I should see the "Check your answers" heading
    # And I submit my answers
    # Then I should see the confirmation page
    # And I should see an NRF reference number
    # And I should see the "What happens next" section
    # And I should see a message that I will receive an email

  # TODO: nrf-frontend Docker base image uses Node 22; dev startup script requires Node >= 24.
  # Build from local source fails until the Dockerfile base image is updated to Node 24.
  # The redirect logic (checkForValidQuoteSession middleware, PR #94) exists in source but is not in the published image.
  @pending
  Scenario: Browser back from confirmation redirects to the start page
    Given I have submitted a Housing development quote
    When I navigate back in the browser
    Then I should be on the start page

  # TODO: same reason as above.
  @pending
  Scenario: Navigating to check your answers after submission redirects to the start page
    Given I have submitted a Housing development quote
    When I navigate to the check your answers page
    Then I should be on the start page

  # TODO: partially blocked by a separate error handling story.
  # The global Hapi error handler already catches backend failures on the confirmation page
  # and renders the error page, so the first assertion ("I am shown a standard error page")
  # is technically testable. However, the error page template (error/index.njk) does not yet
  # include a retry link or a link back to a safe starting point — those are defined in the
  # separate error handling story. This scenario should be revisited once that story is delivered.
  @pending
  Scenario: Confirmation page backend failure shows the standard error page
    Given I have submitted a Housing development quote with an invalid reference
    Then I should see the standard error page
    And I should see a way to retry
    And I should see a way to return to a safe starting point
