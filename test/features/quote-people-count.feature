Feature: Other residential - people count

  Scenario: Developer navigates from people count to email for an Other residential development
    Given I am on the development types page
    When I select "Other residential"
    And I continue
    And I enter "250" as the maximum number of people
    And I continue
    And I select "I don't know the waste water treatment works yet" as the waste water treatment works
    And I continue
    Then I should be on the email page
