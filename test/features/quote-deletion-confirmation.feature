Feature: Quote deletion confirmation

  @smoke @regression
  Scenario: Developer deletes an in-progress quote
    Given I have a quote ready to submit
    When I click the Delete button
    Then I should see the delete quote page
    When I click Yes to confirm deletion
    Then I should see the deletion confirmation page

  @smoke @regression
  Scenario: Developer cancels quote deletion
    Given I have a quote ready to submit
    When I click the Delete button
    And I click No
    Then I should be on the check your answers page

  @regression
  Scenario: Browser back from deletion confirmation redirects to start page
    Given I have a quote ready to submit
    When I click the Delete button
    And I click Yes to confirm deletion
    Then I should see the deletion confirmation page
    When I navigate back in the browser
    Then I should be on the start page
