*** Settings ***
Suite Setup       Suite Setup
Suite Teardown    Suite Teardown
Resource          resource.robot

*** Test Cases ***
Should stay opened after a page refresh
    [Tags]    default    menu

    Navigate To Home

    Menu Should Be Closed

    Open Menu

    Menu Should Be Opened

    Reload Page

    Menu Should Be Opened

*** Keywords ***

Menu Should Be Closed
    Page Should Not Contain Element    ${menuOpened}

Menu Should Be Opened
    Wait Until Page Contains Element    ${menuOpened}    3

*** Variables ***
${menuOpened}    css:mat-drawer.mat-drawer-opened
