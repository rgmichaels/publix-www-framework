@smoke @regression
Feature: Publix site search
  As a visitor
  I want to search for products
  So that I can find relevant results quickly

  Scenario Outline: Search for fixture-backed terms returns valid results
    Given I open the Publix homepage
    When I search using the "<searchTerm>" search fixture
    Then the "<searchTerm>" search results should look valid

    Examples:
      | searchTerm        |
      | sardines          |
      | chickenTenderSub  |
      | banana            |
      | eggs              |
      | milk              |
