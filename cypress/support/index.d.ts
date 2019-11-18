// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />
declare namespace Cypress {
    // noinspection JSUnusedGlobalSymbols
    interface Chainable {
        goToApiLoginPageAndLogin(email?: string, password?: string): Chainable<Element>
        logoutViaApiLogoutUrl(): Chainable<Element>
        loginWithAccessTokenIfNecessary(path: string, waitForAvatar?: boolean): Chainable<Element>
        visitWithApiUrlParam(url: string, options?: Partial<VisitOptions>): Chainable<Element>
        visitApi(url: string, options?: Partial<VisitOptions>): Chainable<Element>
        clickActionSheetButton(index: number): Chainable<Element>
        containsCaseInsensitive(selector: string, content: string): Chainable<Element>
        urlShouldContainCaseInsensitive(content: string): Chainable<Element>
        assertInputValueEquals(selector: string, expected: string): Chainable<Element>
        assertInputValueContains(selector: string, expected: string): Chainable<Element>
        assertInputValueDoesNotContain(selector: string, expected: string): Chainable<Element>
        clearAndType(selector: string, text: string): Chainable<Element>
        goToMobileConnectPage(): Chainable<Element>
        enterCredentials(usernameSelector?: string, username?: string, passwordSelector?: string, password?: string, submitSelector?: string ): Chainable<Element>
        disableSpeechAndSkipIntro(): Chainable<Element>
        enterNewUserCredentials(): Chainable<Element>
        logOutViaSettingsPage(useMenuButton: boolean): Chainable<Element>
        allowUncaughtException(expectedErrorMessage?: string): Chainable<Element>
        checkForBrokenImages(): Chainable<Element>
        iframeLoaded($iframe: any): Chainable<Element>
        getWithinIframe(targetElement: any): Chainable<Element>
        getInDocument(document: any, selector: any): Chainable<Element>
        sendSlackNotification(messageBody?: any): Chainable<Element>
    }
}