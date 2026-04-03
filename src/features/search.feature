@smoke @regression
Feature: Publix site search
  As a visitor
  I want to search for products
  So that I can find relevant results quickly

  Scenario Outline: Search for <searchTerm> returns valid results
    Given I open the Publix homepage
    When I search using the "<fixtureKey>" search fixture
    Then the "<fixtureKey>" search results should look valid

    Examples:
      | fixtureKey  | searchTerm |
      | sardines    | sardines   |
      | iceCream    | Ice Cream  |
      | asparagus   | Asparagus  |
      | banana      | Banana     |
      | salmon      | Salmon     |
      | milk        | Milk       |
      | yogurt      | Yogurt     |
      | cereal      | Cereal     |
