@regression
Feature: Publix primary navigation
  As a visitor
  I want the top navigation menus to open and expose valid destinations
  So that I can reach key sections quickly

  Scenario: Header flyout menu links are valid
    Given I open the Publix homepage
    Then the savings, order ahead, and catering menus should expose working fixture links
