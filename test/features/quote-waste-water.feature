@smoke @regression
Feature: Waste water treatment works selection

  Background:
    Given I have navigated to the waste water treatment works page

  @smoke @regression
  Scenario: WWTW options are loaded for the development EDP
    Then I should see the "Confirm which waste water treatment works will be used for this development" heading
    And the waste water treatment works options should be listed

  @smoke @regression
  Scenario: Multiple waste water treatment works are displayed with distances
    Then I should see more than 1 waste water treatment works option
    And each waste water treatment works option should show the distance from the development boundary
    And only one option can be selected at a time
    And I should see the "I don't know the waste water treatment works yet" option

  @smoke @regression
  Scenario: Select a specific waste water treatment works and continue
    When I select the first waste water treatment works option
    And I continue
    Then I should see the "Enter your email address" heading

  @smoke @regression
  Scenario: Select I don't know the waste water treatment works yet
    When I select "I don't know the waste water treatment works yet" as the waste water treatment works
    And I continue
    Then I should see the "Enter your email address" heading

  # The frontend pre-selects "I don't know" by default, so the validation error
  # cannot be triggered through normal navigation. Server-side validation is
  # covered by the unit test in waste-water/page.test.js.
  @pending
  Scenario: Validation error when no option is selected
    When I continue
    Then I should see a validation error "Select a waste water treatment works, or select that you do not know yet"

  @smoke @regression
  Scenario: Back from the email page returns to waste water treatment works with answer preserved
    When I select "I don't know the waste water treatment works yet" as the waste water treatment works
    And I continue
    Then I should see the "Enter your email address" heading
    When I navigate back in the browser
    Then I should see the "Confirm which waste water treatment works will be used for this development" heading
    And the "I don't know the waste water treatment works yet" option should be selected

  @regression
  Scenario: RLB change clears the previous waste water treatment works answer
    When I select the first waste water treatment works option
    And I continue
    Then I should see the "Enter your email address" heading
    When I upload a different boundary file
    And I navigate through the quote to the waste water treatment works page
    Then the previously selected waste water treatment works should be cleared
