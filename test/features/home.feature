Feature: Home page

  @smoke @regression
  Scenario: Home page title is correct
    Given I am on the home page
    Then the page title should be "Nature Restoration Fund - Gov.uk"

  @smoke @regression
  Scenario: Home page shows the beta phase banner
    Given I am on the home page
    Then I should see a "Beta" phase banner
    And the phase banner should contain a "feedback" link
