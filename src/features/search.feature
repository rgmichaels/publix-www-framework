@smoke @regression
Feature: Publix site search
  As a visitor
  I want to search for products
  So that I can find relevant results quickly

  Scenario: Search for sardines returns valid results
    Given I open the Publix homepage
    When I search using the "sardines" search fixture
    Then the "sardines" search results should look valid

  Scenario: Search for chicken tender sub returns valid results
    Given I open the Publix homepage
    When I search using the "chickenTenderSub" search fixture
    Then the "chickenTenderSub" search results should look valid
