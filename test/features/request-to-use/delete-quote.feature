@regression
Feature: Delete quote from the request to use journey

  Background:
    Given I have created a quote for Nature Restoration Levy
    When I follow the request to use link in the quote email
    Then I should see the "Enter your NRL reference" heading
    And the NRL reference from my quote is pre-filled
    Then I should see the "Enter your email address" heading
    When I enter "nrfjourneytests@gmail.com" as my email
    Then I should see the email confirmation page
    And I have been sent the retrieve quote email
    When I follow the magic link in the email
    Then I should see the review and amend quote details page
    And I note the number of housing units
    When I continue
    Then I should see the levy amounts for my number of housing units
    When I decline the levy amount
    Then I should see the are you sure you want to delete this quote page

  Scenario: The back link returns to the review and amend page
    When I click the back link
    Then I should see the review and amend quote details page

  Scenario: Cancelling returns to the review and amend page with the quote unchanged
    When I cancel deleting my quote
    Then I should see the review and amend quote details page
    And my quote details are unchanged on the review and amend quote details page

  @pending
  Scenario: Deleting the quote shows the your details have been deleted page
    When I delete my quote
    Then I should be taken to "/request-to-use/delete-quote-confirmation"
    And I should see the your details have been deleted page
