@regression
Feature: Original planning permission committed question in the request to use journey

  Scenario: An amendment to a planning permission that was not committed continues to who the levy is for
    Given I have created a quote for Nature Restoration Levy
    And I am on the review and amend quote details page for my quote
    And I continue
    When I accept the levy amount
    And I say the development is an amendment
    And I say the original planning permission was not committed
    Then I should be taken to "/request-to-use/defra-account-user-type"
