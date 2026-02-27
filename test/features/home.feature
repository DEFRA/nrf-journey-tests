Feature: Home page

  @smoke @regression
  Scenario: Home page title is correct
    Given I am on the home page
    Then the page title should be "Nature Restoration Fund - Gov.uk"
