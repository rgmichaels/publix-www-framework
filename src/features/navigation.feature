@regression
Feature: Publix primary navigation
  As a visitor
  I want the top navigation menus to open and expose valid destinations
  So that I can reach key sections quickly

  Scenario: Header flyout menu links are valid
    Given I open the Publix homepage
    Then the savings, order ahead, and catering menus should expose working fixture links

  Scenario: Weekly Ad link navigates to the weekly ad page
    Given I open the Publix homepage
    When I click the Weekly Ad link on the homepage
    Then I should land on a weekly ad page
    And the page should display "weekly ad" text

  Scenario: Savings digital coupons item navigates to the digital coupons page
    Given I open the Publix homepage
    When I click the "Digital coupons" item in the "savings" menu
    Then I should land on the digital coupons page

  Scenario: Locations link navigates to the locations page
    Given I open the Publix homepage
    When I click the Locations link on the homepage
    Then I should land on the locations page

  Scenario: Pharmacy link navigates to the pharmacy page
    Given I open the Publix homepage
    When I click the Pharmacy link on the homepage
    Then I should land on the pharmacy page

  Scenario: Contact Us link navigates to the contact page
    Given I open the Publix homepage
    When I click the Contact Us link on the homepage
    Then I should land on a contact us page

  Scenario: About Publix link navigates to the about page
    Given I open the Publix homepage
    When I click the About Publix link on the homepage
    Then I should land on an about publix page

  Scenario: Shop all Catering item navigates to the catering page
    Given I open the Publix homepage
    When I click the "Shop all Catering" item in the "catering" menu
    Then I should land on the catering page

  Scenario: Easter Meals link navigates to its destination
    Given I open the Publix homepage
    When I click the "Easter Meals" visual navigation link on the homepage
    Then the "Easter Meals" visual navigation destination should load

  Scenario: Subs & Wraps link navigates to its destination
    Given I open the Publix homepage
    When I click the "Subs & Wraps" visual navigation link on the homepage
    Then the "Subs & Wraps" visual navigation destination should load

  Scenario: Cakes link navigates to its destination
    Given I open the Publix homepage
    When I click the "Cakes" visual navigation link on the homepage
    Then the "Cakes" visual navigation destination should load

  Scenario: Platters & Catering link navigates to its destination
    Given I open the Publix homepage
    When I click the "Platters & Catering" visual navigation link on the homepage
    Then the "Platters & Catering" visual navigation destination should load

  Scenario: Sub-Style Salads link navigates to its destination
    Given I open the Publix homepage
    When I click the "Sub-Style Salads" visual navigation link on the homepage
    Then the "Sub-Style Salads" visual navigation destination should load

  Scenario: Grocery Delivery link navigates to its destination
    Given I open the Publix homepage
    When I click the "Grocery Delivery" visual navigation link on the homepage
    Then the "Grocery Delivery" visual navigation destination should load

  Scenario: Deli Meat & Cheese link navigates to its destination
    Given I open the Publix homepage
    When I click the "Deli Meat & Cheese" visual navigation link on the homepage
    Then the "Deli Meat & Cheese" visual navigation destination should load
