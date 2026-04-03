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
