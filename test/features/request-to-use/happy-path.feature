@regression
Feature: Request to use journey

  Scenario: Housing developer completes request to use journey
    Given I have a Defra ID account as an employee
    And I have created a quote for Nature Restoration Levy

    And I am on the review and amend quote details page for my quote
    And I note the number of housing units
    When I continue
    Then I should see the levy amounts for my number of housing units
    When I accept the levy amount
    And I say the development is an amendment
    And I say the original planning permission was not committed
    And I request to use the levy for "The business or organisation you work for"
    And I continue from the "You'll need to create or join a Defra account for your business or organisation" page
    And I sign in to Defra ID
    Then I should be signed in and can enter my address
    When I enter the address details
    Then I should be taken to the review details page showing
      | row           | value                  | change link |
      | Full name     | Helen Hanks           | no          |
      | Business name | Hamblin Housebuilders | no          |
      | Address       | 1 Development Road    | yes         |
    When I click Change for "Address" on the review details page
    Then I should be signed in and can enter my address
    When I change the address details
    Then I should see "2 Amended Street" for "Address" on the review details page
    When I confirm the details
    Then I should be taken to "/request-to-use/read-this"
    And I should see the read this page content
    When I continue
    Then I should be taken to the check your answers page showing
      | row                                                | value                                     | change link |
      | Accept levy amount                                 | Yes, accept this amount                   | yes         |
      | Amendment to an existing planning permission       | Yes                                       | yes         |
      | Original planning permission committed to the levy | No                                        | yes         |
      | Original NRL reference                             | Not applicable                            | no          |
      | Requesting to use the levy as                      | The business or organisation you work for | no          |
      | Full name                                          | Helen Hanks                               | no          |
      | Developer business name                            | Hamblin Housebuilders                     | no          |
      | Address                                            | 2 Amended Street                          | yes         |
      | Planning permission type                           | Full planning permission                  | no          |
      | Housing                                            | Yes                                       | no          |
      | Number of housing units                            | 10                                        | no          |
      | Red line boundary                                  | Added                                     | no          |
      | Email address                                      | nrfjourneytests@gmail.com                 | no          |
    When I follow the "review your quote" link
    Then I should be taken to "/request-to-use/review-quote-details"
    When I navigate back in the browser
    Then I should be taken to the check your answers page
    When I follow the "Delete quote details" link
    Then I should see the are you sure you want to delete this quote page
    When I click the back link
    Then I should be taken to the check your answers page
    When I click Change for "Accept levy amount" on the check your answers page
    Then I should be taken to "/request-to-use/change/accept-levy"
    When I click the back link
    Then I should be taken to the check your answers page
    When I click Change for "Accept levy amount" on the check your answers page
    Then I should be taken to "/request-to-use/change/accept-levy"
    When I accept the levy amount
    Then I should be taken to the check your answers page
    When I click Change for "Original planning permission committed to the levy" on the check your answers page
    Then I should be taken to "/request-to-use/change/original-committed"
    When I click the back link
    Then I should be taken to the check your answers page
    When I click Change for "Original planning permission committed to the levy" on the check your answers page
    And I say the original planning permission was not committed
    Then I should be taken to the check your answers page
    When I click Change for "Amendment to an existing planning permission" on the check your answers page
    Then I should be taken to "/request-to-use/change/variation"
    When I click the back link
    Then I should be taken to the check your answers page
    When I click Change for "Amendment to an existing planning permission" on the check your answers page
    And I say the development is not an amendment
    Then I should be taken to the check your answers page
    And I should see "No" for "Amendment to an existing planning permission" on the check your answers page
    When I click Change for "Amendment to an existing planning permission" on the check your answers page
    And I say the development is an amendment
    Then I should be taken to "/request-to-use/change/original-committed"
    When I say the original planning permission was not committed
    Then I should be taken to the check your answers page
    And I should see "Yes" for "Amendment to an existing planning permission" on the check your answers page
    And I should see "No" for "Original planning permission committed to the levy" on the check your answers page
    And I should see "Not applicable" for "Original NRL reference" on the check your answers page
    When I click Change for "Address" on the check your answers page
    Then I should be signed in and can enter my address
    When I click the back link
    Then I should be taken to the check your answers page
    When I click Change for "Address" on the check your answers page
    Then I should be signed in and can enter my address
    When I enter the address details
    Then I should be taken to the check your answers page
    And I should see "1 Development Road" for "Address" on the check your answers page
    When I confirm the declaration
    Then I should see the your details have been submitted page

  Scenario: Individual completes request to use journey
    Given I have a Defra ID account as an individual
    And I have created a quote for Nature Restoration Levy

    And I am on the review and amend quote details page for my quote
    And I note the number of housing units
    When I continue
    Then I should see the levy amounts for my number of housing units
    When I accept the levy amount
    And I say the development is not an amendment
    And I request to use the levy for "Yourself, as an individual"
    And I continue from the "You'll need to create or sign in to a Defra account as an individual" page
    And I sign in to Defra ID
    Then I should be signed in and can enter my address
    When I enter the address details
    Then I should be taken to the review details page showing
      | row       | value              | change link |
      | Full name | Chas Chandler      | no          |
      | Address   | 1 Development Road | yes         |
    When I click Change for "Address" on the review details page
    Then I should be signed in and can enter my address
    When I enter the address details
    Then I should be taken to the review details page
    When I confirm the details
    Then I should be taken to "/request-to-use/read-this"
    And I should see the read this page content
    When I continue
    Then I should be taken to the check your answers page showing
      | row                                          | value                      | change link |
      | Accept levy amount                           | Yes, accept this amount    | yes         |
      | Amendment to an existing planning permission | No                         | yes         |
      | Requesting to use the levy as                | Yourself, as an individual | no          |
      | Full name                                    | Chas Chandler              | no          |
      | Address                                      | 1 Development Road         | yes         |
      | Planning permission type                     | Full planning permission   | no          |
      | Housing                                      | Yes                        | no          |
      | Number of housing units                      | 10                         | no          |
      | Red line boundary                            | Added                      | no          |
      | Email address                                | nrfjourneytests@gmail.com  | no          |
    When I confirm the declaration
    Then I should see the your details have been submitted page

  Scenario: Agent completes request to use journey
    Given I have a Defra ID account as an agent
    And I have created a quote for Nature Restoration Levy

    And I am on the review and amend quote details page for my quote
    And I note the number of housing units
    When I continue
    Then I should see the levy amounts for my number of housing units
    When I accept the levy amount
    And I say the development is not an amendment
    And I request to use the levy for "A client you act for as an agent or third party"
    And I continue from the "Your client will need to create a Defra account and invite you as an agent or third party" page
    And I sign in to Defra ID and am shown the organisation picker
    And I choose "IVY HOUSEBUILDERS LIMITED" on the organisation picker
    Then I should be signed in and can enter my address
    When I enter the developer details
    Then I should be taken to the review details page showing
      | row           | value                     | change link |
      | Full name     | Trevor Barker             | yes         |
      | Business name | IVY HOUSEBUILDERS LIMITED | no          |
      | Address       | 1 Development Road        | yes         |
    When I click Change for "Full name" on the review details page
    Then I should be signed in and can enter my address
    When I change the developer details
    Then I should see "Amber Barker" for "Full name" on the review details page
    And I should see "2 Amended Street" for "Address" on the review details page
    When I confirm the details
    Then I should be taken to "/request-to-use/read-this"
    And I should see the read this page content
    When I continue
    Then I should be taken to the check your answers page showing
      | row                                          | value                                           | change link |
      | Accept levy amount                           | Yes, accept this amount                         | yes         |
      | Amendment to an existing planning permission | No                                              | yes         |
      | Requesting to use the levy as                | A client you act for as an agent or third party | no          |
      | Full name                                    | Amber Barker                                    | yes         |
      | Developer business name                      | IVY HOUSEBUILDERS LIMITED                       | no          |
      | Address                                      | 2 Amended Street                                | yes         |
      | Planning permission type                     | Full planning permission                        | no          |
      | Housing                                      | Yes                                             | no          |
      | Number of housing units                      | 10                                              | no          |
      | Red line boundary                            | Added                                           | no          |
      | Email address                                | nrfjourneytests@gmail.com                       | no          |
    When I confirm the declaration
    Then I should see the your details have been submitted page
