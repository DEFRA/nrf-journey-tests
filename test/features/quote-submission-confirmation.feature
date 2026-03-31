@smoke @regression
Feature: Quote submission confirmation

  @regression
  Scenario: Browser back from confirmation redirects to the start page
    Given I have submitted a Housing development quote
    When I navigate back in the browser
    Then I should be on the start page

  @regression
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
