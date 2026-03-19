Feature: Other residential - people count

  @smoke @regression
  Scenario: Developer navigates from people count to email for an Other residential development
    Given I am on the development types page
    When I select "Other residential"
    And I continue
    And I enter "250" as the maximum number of people
    And I continue
    Then I should be on the email page
