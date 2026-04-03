@smoke @regression
Feature: Publix homepage
  As a visitor
  I want the homepage to load correctly
  So that I can begin browsing the site

  Scenario: Homepage loads successfully
    Given I open the Publix homepage
    Then the homepage loads successfully

  @regression
  Scenario: Club popup appears with expected copy and actions
    Given I open the Publix homepage
    Then the Club popup appears with expected copy
    And the Club popup has a "Sign up" button and a "Log in" button
