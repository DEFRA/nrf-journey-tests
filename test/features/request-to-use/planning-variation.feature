@regression
Feature: Planning variation questions in the request to use journey

  Scenario: An amendment to a planning permission that was not committed continues to who the levy is for
    Given I have created a quote for Nature Restoration Levy
    And I am on the review and amend quote details page for my quote
    And I continue
    When I accept the levy amount
    And I say the development is an amendment
    And I say the original planning permission was not committed
    Then I should be taken to "/request-to-use/defra-account-user-type"

  Scenario: Entering the NRL reference for the original planning permission when the boundaries match
    Given I have created a quote for Nature Restoration Levy
    And I am on the review and amend quote details page for my quote
    And I have submitted my request to use the levy
    And I continue
    When I accept the levy amount
    And I say the development is an amendment
    And I say the original planning permission was committed
    And I enter the NRL reference of my submitted request as the original NRL reference
    Then I should be taken to "/request-to-use/defra-account-user-type"

  Scenario: Entering the NRL reference for an original planning permission with a different boundary
    Given I have created a quote for Nature Restoration Levy
    And I am on the review and amend quote details page for my quote
    And I have submitted my request to use the levy
    And I have created another quote for Nature Restoration Levy with a different boundary
    And I am on the review and amend quote details page for my quote
    And I continue
    When I accept the levy amount
    And I say the development is an amendment
    And I say the original planning permission was committed
    And I enter the NRL reference of my submitted request as the original NRL reference
    Then I should be taken to "/request-to-use/original-boundary-not-matched"
    And I should see the "Details do not match" heading

  Scenario: Amending the red line boundary to match the original planning permission
    Given I have created a quote for Nature Restoration Levy
    And I am on the review and amend quote details page for my quote
    And I have submitted my request to use the levy
    And I have created another quote for Nature Restoration Levy with a different boundary
    And I am on the review and amend quote details page for my quote
    And I continue
    When I accept the levy amount
    And I say the development is an amendment
    And I say the original planning permission was committed
    And I enter the NRL reference of my submitted request as the original NRL reference
    Then I should be taken to "/request-to-use/original-boundary-not-matched"
    And I should see the "Details do not match" heading
    When I follow the "amend your red line boundary" link
    And I click Change for "Red line boundary" on the review and amend quote details page
    And I select "Upload a file" as my boundary type
    And I continue
    And I upload "test/fixtures/original_boundary.geojson" as my boundary file
    And I save and continue on the boundary preview
    Then I should see the review and amend quote details page
    When I continue
    And I accept the levy amount
    And I say the development is an amendment
    And I say the original planning permission was committed
    And I enter the NRL reference of my submitted request as the original NRL reference
    Then I should be taken to "/request-to-use/defra-account-user-type"

  Scenario: Entering an original NRL reference that does not exist
    Given I have created a quote for Nature Restoration Levy
    And I am on the review and amend quote details page for my quote
    And I continue
    When I accept the levy amount
    And I say the development is an amendment
    And I say the original planning permission was committed
    And I enter "NRL-999999" as the original NRL reference
    Then I should be taken to "/request-to-use/original-reference-not-matched"
