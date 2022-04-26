*** Settings ***
Library     SeleniumLibrary
Library     OperatingSystem
Resource    ./css_selectors.robot

*** Variables ***
${BROWSER}            Chrome
${BASE_URL}           %{BASE_URL}
${DEFAULT_TIMEOUT}    2

*** Keywords ***
Suite Setup
    ChromeDriver Setup

Suite Teardown
    Close All Browsers

ChromeDriver Setup
    ${chrome options} =    Evaluate             sys.modules['selenium.webdriver'].ChromeOptions()    sys, selenium.webdriver
    Call Method            ${chrome options}    add_argument                                         headless
    Call Method            ${chrome options}    add_argument                                         disable-gpu
    Call Method            ${chrome options}    add_argument                                         disable-extensions
    Call Method            ${chrome options}    add_argument                                         disable-dev-shm-usage
    Call Method            ${chrome options}    add_argument                                         no-sandbox
    Create Webdriver       Chrome               chrome_options=${chrome options}
    Set Window Size        1920                 1080

Navigate To Home
    Go To    ${BASE_URL}

Open Menu
    Click Element            ${menuButton}
    Wait For Animation
    Menu Should Be Opened

Menu Should Be Opened
    Wait Until Page Contains Element    ${menuOpened}    ${DEFAULT_TIMEOUT}

Wait For Animation
    Sleep    ${DEFAULT_TIMEOUT}
