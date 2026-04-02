@regression
Feature: Publix primary navigation
  As a visitor
  I want the top navigation menus to open and expose valid destinations
  So that I can reach key sections quickly

  Scenario Outline: Header flyout menu links are valid
    Given I open the Publix homepage
    Then the "<menuKey>" menu should expose working fixture links

    Examples:
      | menuKey     |
      | savings     |
      | orderAhead  |
      | catering    |
