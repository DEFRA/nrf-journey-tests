Feature: Quote deletion confirmation

  @regression
  Scenario: Browser back from deletion confirmation redirects to start page
    Given I have a quote ready to submit
    When I click the Delete button
    And I click Yes to confirm deletion
    Then I should see the deletion confirmation page
    When I navigate back in the browser
    Then I should be on the start page
