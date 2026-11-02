@regression
Feature: Delete quote from the request to use journey

  Background:
    Given I have created a quote for Nature Restoration Levy
    And I am on the review and amend quote details page for my quote
    And I continue
    When I decline the levy amount
    Then I should see the are you sure you want to delete this quote page

  Scenario: Deleting the quote shows the your details have been deleted page
    When I delete my quote
    Then I should be taken to "/request-to-use/delete-quote-confirmation"
    And I should see the your details have been deleted page
    When I navigate back in the browser
    Then I should be on the start page
