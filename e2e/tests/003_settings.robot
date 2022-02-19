*** Settings ***
Suite Setup       Suite Setup
Suite Teardown    Suite Teardown
Resource          fixture.robot

*** Test Cases ***
Should remember light theme after page refresh
    [Tags]    default    settings

    Navigate To Home

    Open Menu
    Click Settings Menu

    Should Be On Settings Page
    Dark Theme Should Be Selected

    Select Light Theme
    Light Theme Should Be Selected

    Wait For Animation

    Reload Page

    Light Theme Should Be Selected


*** Keywords ***
Click Settings Menu
    Click Element    css:app-navigation-menu > mat-nav-list > a:nth-child(3)

Should Be On Settings Page
    Wait Until Element Contains    css:app-settings-list > div > h1    Select theme    ${DEFAULT_TIMEOUT}

Dark Theme Should Be Selected
    Wait Until Page Contains Element    ${darkTheme}.mat-radio-checked    ${DEFAULT_TIMEOUT}

Light Theme Should Be Selected
    Wait Until Page Contains Element    ${lightTheme}.mat-radio-checked    ${DEFAULT_TIMEOUT}

Select Light Theme
    Sleep    0.5s
    Click Element    ${lightTheme}

*** Variables ***
${lightTheme}    css:#theme-0
${darkTheme}     css:#theme-1
