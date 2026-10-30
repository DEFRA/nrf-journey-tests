@regression
Feature: Delete quote from the request to use journey

  Background:
    Given I have created a quote for Nature Restoration Levy
    When I follow the request to use link in the quote email
    And the NRL reference from my quote is pre-filled
    And I enter "nrfjourneytests@gmail.com" as my email
    And I have been sent the retrieve quote email
    And I follow the magic link in the email
    And I continue
    When I decline the levy amount
    Then I should see the are you sure you want to delete this quote page

  Scenario: The back link returns to the review and amend page
    When I click the back link
    Then I should see the review and amend quote details page

  Scenario: Cancelling returns to the review and amend page
    When I cancel deleting my quote
    Then I should see the review and amend quote details page

  Scenario: Deleting the quote shows the your details have been deleted page
    When I delete my quote
    Then I should be taken to "/request-to-use/delete-quote-confirmation"
    And I should see the your details have been deleted page
    When I navigate back in the browser
    Then I should be on the start page
