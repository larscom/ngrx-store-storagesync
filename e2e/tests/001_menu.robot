*** Settings ***
Suite Setup       Suite Setup
Suite Teardown    Suite Teardown
Resource          fixture.robot

*** Test Cases ***
Should stay opened after a page refresh
    [Tags]    default    menu

    Navigate To Home

    Menu Should Be Closed

    Open Menu

    Reload Page

    Menu Should Be Opened

*** Keywords ***
Menu Should Be Closed
    Page Should Not Contain Element    ${menuOpened}
