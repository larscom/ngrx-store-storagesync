*** Settings ***
Suite Setup       Suite Setup
Suite Teardown    Suite Teardown
Resource          resource.robot

*** Test Cases ***
Should remember completed todo items after page refresh
    [Tags]    default    todo

    Navigate To Home
    Should Be On Todo Page

    Should Not Have Completed Todo Items
    Should Have Todo Item Count Of          3

    Add Todo Item                     new todo
    Should Have Todo Item Count Of    4

    Complete All Todo Items
    Should Have Completed Todo Item Count Of    4

    Reload Page
    Should Have Completed Todo Item Count Of    4


*** Keywords ***
Should Be On Todo Page
    Wait Until Element Contains    css:app-todo-list > div > h1    Todo List    ${DEFAULT_TIMEOUT}

Should Not Have Completed Todo Items
    Page Should Not Contain Element    ${completedCount}

Should Have Todo Item Count Of
    [Arguments]    ${count}

    Element Should Contain    css:app-todo-list > div > h2    Todo (${count})

Click Todo Item
    [Arguments]    ${number}

    Click Element    css:app-todo-list mat-list-option#todo-${number}

Add Todo Item
    [Arguments]    ${todo}

    Input Text       css:app-todo-list input#add-todo     ${todo}
    Click Element    css:app-todo-list button#add-todo


Complete All Todo Items
    Click Todo Item    0
    Click Todo Item    1
    Click Todo Item    2
    Click Todo Item    3
    Sleep              1


Should Have Completed Todo Item Count Of
    [Arguments]    ${count}

    Wait Until Element Contains    ${completedCount}    Completed (${count})    ${DEFAULT_TIMEOUT}

*** Variables ***
${completedCount}    css:app-todo-list #completed-count

