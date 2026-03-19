Feature: Other residential - people count

  @smoke @regression
  Scenario: Previously entered value persists when navigating back from email page
    Given I am on the development types page
    When I select "Other residential"
    And I continue
    And I enter "250" as the maximum number of people
    And I continue
    And I click the Back link
    Then the people count field should contain "250"

  @regression
  Scenario: Continuing without entering a value shows a validation error
    Given I am on the people count page for an Other residential development
    When I continue
    Then I should see the error "Enter the maximum number of people to continue"

  @regression
  Scenario: Entering zero shows a validation error
    Given I am on the people count page for an Other residential development
    When I enter "0" as the maximum number of people
    And I continue
    Then I should see the error "Enter a whole number greater than zero"

  @regression
  Scenario: Entering a negative number shows a validation error
    Given I am on the people count page for an Other residential development
    When I enter "-100" as the maximum number of people
    And I continue
    Then I should see the error "Enter a whole number greater than zero"

  @regression
  Scenario: Entering a decimal value shows a validation error
    Given I am on the people count page for an Other residential development
    When I enter "90.5" as the maximum number of people
    And I continue
    Then I should see the error "Enter a whole number greater than zero"
