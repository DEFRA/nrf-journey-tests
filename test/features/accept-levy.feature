@regression
Feature: NRF2-1302 Do you accept this nature restoration levy amount

  Scenario: Recalculated levy is shown, can be left, and the answer decides the next page
    Given I have reached the review and amend quote details page through the request to use journey

    # Continuing from the review page recalculates the levy and shows it
    When I continue
    Then I should be taken to "/request-to-use/accept-levy"
    And I should see the "Do you accept this nature restoration levy amount?" heading
    And I should see the provisional and inflation-adjusted levy amounts on the accept levy page

    # Back returns to the review page
    When I click the back link
    Then I should see the review and amend quote details page

    # Declining goes to the delete quote page
    When I continue
    And I choose "No, delete my quote details" on the accept levy page
    And I continue
    Then I should be taken to "/request-to-use/delete-quote"

  Scenario: Accepting the levy amount goes to the enter address page
    Given I have reached the review and amend quote details page through the request to use journey
    When I continue
    And I choose "Yes, accept this amount" on the accept levy page
    And I continue
    Then I should be taken to "/request-to-use/enter-address"
