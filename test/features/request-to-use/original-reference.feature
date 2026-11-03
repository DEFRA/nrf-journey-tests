@regression
Feature: Original NRL reference page

  Scenario: Entering the original NRL reference and continuing
    Given I have created a quote for Nature Restoration Levy
    And I am on the review and amend quote details page for my quote
    When I continue
    And I accept the levy amount
    And I click the back link
    Then I should see the "Enter the NRL reference for the original planning permission" heading
    When I enter "NRL-123456" as the original NRL reference
    Then I should see the "Who are you requesting to use the nature restoration levy for?" heading

  @pending
  Scenario: Entering the original reference from the original commitment page
    Given I have created a quote for Nature Restoration Levy
    And I am on the review and amend quote details page for my quote
    When I continue
    And I accept the levy amount
    And I answer "Yes" to the original planning permission being committed to using the nature restoration levy
    Then I should see the "Enter the NRL reference for the original planning permission" heading
    When I click the back link
    Then I should see the "Was the original planning permission committed to using the nature restoration levy?" heading
