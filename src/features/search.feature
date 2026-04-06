@smoke @regression
Feature: Publix site search
  As a visitor
  I want to search for products
  So that I can find relevant results quickly

  Scenario Outline: Search for fixture-backed terms returns valid results
    Given I open the Publix homepage
    When I search using the "<fixtureKey>" search fixture
    Then the "<fixtureKey>" search results should look valid

    Examples:
      | fixtureKey        |
      | sardines          |
      | chickenTenderSub  |
      | banana            |
      | eggs              |
      | milk              |
