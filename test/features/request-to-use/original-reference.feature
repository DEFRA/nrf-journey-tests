@regression
Feature: Original NRL reference question in the request to use journey

  Scenario: Entering the NRL reference for the original planning permission
    Given I have created a quote for Nature Restoration Levy
    And I am on the review and amend quote details page for my quote
    And I continue
    When I accept the levy amount
    And I say the development is an amendment
    And I say the original planning permission was committed
    Then I should see the "Enter the NRL reference for the original planning permission" heading
    When I click the back link
    And I say the original planning permission was committed
    And I enter "NRL-123456" as the original NRL reference
    Then I should be taken to "/request-to-use/defra-account-user-type"
