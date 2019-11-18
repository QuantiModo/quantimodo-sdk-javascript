const str = require('./qm.string-helper')
const fileHelper = require('./qm.file-helper')
const beautify = require('beautify')
function addIfCommandThrowException(cmd){
    cmd = str.replaceQuoteBracketsWithBackTicks(cmd);
    cmd = str.replaceQuoteBracketsWithBackTicks(cmd);
    cmd = str.stripLineBreaks(cmd);
    //cmd = cmd.replace('document.querySelector', 'cy.get');
    if(cmd.indexOf("if((cy.get(") !== -1){
        cmd = "//" + cmd;
    }
    cmd = cmd.replace(';)', ')');
    return cmd;
}
function convertSeleniumToCypress(baseOutputFolder, seleniumTestPath){
    function generateOneCypressTest(seleniumTest){
        let closingTags = '';
        let code = '';
        let selectors = {};
        function addLine(line){
            if(line.indexOf(" === ") !== -1 && line.indexOf("cy.get") !== -1){
                line = "//" + line;
            }
            console.debug(line);
            code += "\n" + line + ";";
            //addDebug(line);
        }
        function addConsoleInfo(line){
            line = str.stripQuotes(line);
            line = str.stripLineBreaks(line);
            code += "\n console.info('" + line + "');";
        }
        function addLineWithThen(line){
            addLine(line);
        }
        let globalVariables = 'let apiUrl = process.env.API_URL || "https://app.quantimo.do";\n' +
            'let testUserName = "testuser";\n' +
            'let testUserPassword = "testing123";\n' +
            'let accessToken = "test-token";\n' +
            'let clientId = "oauth_test_client";\n' +
            'let logLevel = "info";\n' +
            'let OAUTH_APP_HOST = "medimodo.herokuapp.com";\n' +
            'let appHostName = process.env.APP_HOST_NAME || "medimodo.herokuapp.com";\n' +
            'let initialUrl = "https://"+appHostName+"/#/";\n';
        seleniumTest.commands.forEach(function(step){
            if(step.comment && step.comment !== ""){
                addConsoleInfo(step.comment);
            }
            // noinspection JSUnusedGlobalSymbols
            let handlers = {
                store: function(){
                    if(step.value === "initialUrl"){
                        return;
                    }
                    let line = `${step.value} = '${step.target}'`;
                    if(code.indexOf("let " + step.value) === -1){
                        line = "let " + line;
                    }
                    addLine(line);
                    selectors[step.value] = step.target;
                },
                open: function(){
                    let url = step.target;
                    url = str.stripLineBreaks(url);
                    if(!url || url === ''){
                        addLineWithThen(`cy.visit(initialUrl)`)
                    }else{
                        addLineWithThen(`cy.visit('${url}')`)
                    }
                },
                executeScript: function(){
                    let value = step.value;
                    if(value === "initialUrl"){
                        return;
                    }
                    let cmd = step.target;
                    if(cmd.indexOf('return document.querySelector(') === 0 && step.value !== "checkReturnValue"){
                        cmd = 'let ' + step.value + ' = ' + cmd.replace('return document.querySelector(', "cy.get(");
                        cmd = cmd.replace(';', ");");
                        cmd = str.replaceQuoteBracketsWithBackTicks(cmd);
                        cmd = str.replaceQuoteBracketsWithBackTicks(cmd);
                        addLine(cmd);
                        return;
                    }
                    if(cmd.indexOf('return document.querySelector(') === 0 && cmd.indexOf(' === ') !== -1){
                        cmd = cmd.replace('return document.querySelector(', "cy.get(");
                        cmd = cmd.replace(') === ', ").should('contain',") + ")";
                        cmd = str.stripLiteralBrackets(cmd);
                        addLine(cmd);
                        return;
                    }
                    if(cmd.indexOf('return window.location.href.indexOf') !== -1){
                        let fragment = cmd.replace('return window.location.href.indexOf(', "");
                        fragment = fragment.substr(0, fragment.indexOf(")"));
                        if(cmd.indexOf(" === -1") !== -1){
                            cmd = "cy.url().should('not.contain', " + fragment + ")";
                        }else{
                            cmd = "cy.url().should('contain', " + fragment + ")";
                        }
                        addLine(cmd);
                        return;
                    }
                    if(cmd.indexOf('return window.location.hash === ') !== -1){
                        cmd = cmd.replace('return window.location.hash === ', "cy.url().should('include', ");
                        cmd = cmd.replace(';', ");");
                        cmd = str.replaceQuoteBracketsWithBackTicks(cmd);
                        cmd = str.replaceQuoteBracketsWithBackTicks(cmd);
                        addLine(cmd);
                        return;
                    }
                    if(cmd.indexOf('window.location = ') !== -1){
                        cmd = str.stripLineBreaks(cmd);
                        cmd = cmd.replace('window.location = ', 'cy.visit(');
                        cmd = cmd.replace(';', ')');
                        if(cmd.indexOf("cy.visit('')") !== -1){
                            throw cmd;
                        }
                        cmd = str.replaceQuotesWithBackTicks(cmd);
                        addLineWithThen(cmd);
                        return;
                    }
                    if(cmd.indexOf(' content.includes') !== -1){
                        cmd = cmd.replace('const element = document.querySelector', 'cy.get');
                        cmd = cmd.replace(');', ')');
                        cmd = cmd.replace(
                            'const content = (element.textContent || element.innerText || element.value || \'\');\n' +
                            'return content.includes(',
                            ".should('contain', ");
                        cmd = str.replaceQuoteBracketsWithBackTicks(cmd);
                        cmd = str.replaceQuoteBracketsWithBackTicks(cmd);
                        addLine(cmd);
                        return;
                    }
                    if(cmd.indexOf(' !content.includes') !== -1){
                        cmd = cmd.replace('const element = document.querySelector', 'cy.get');
                        cmd = cmd.replace(');', ')');
                        cmd = cmd.replace(
                            'const content = (element.textContent || element.innerText || element.value || \'\');\n' +
                            'return !content.includes(',
                            ".should('not.contain', ");
                        cmd = cmd.replace(');', ')');
                        cmd = addIfCommandThrowException(cmd);
                        addLine(cmd);
                        return;
                    }
                    if(cmd.indexOf('return content !== ') !== -1){
                        cmd = cmd.replace('const element = document.querySelector', 'cy.get');
                        cmd = cmd.replace(');', ')');
                        cmd = cmd.replace(
                            'const content = (element.textContent || element.innerText || element.value || \'\');\n' +
                            'return content !== ',
                            ".should('not.contain', ") + ")";
                        cmd = cmd.replace(';)', ')');
                        cmd = str.replaceQuoteBracketsWithBackTicks(cmd);
                        addLine(cmd);
                        return;
                    }
                    if(cmd.indexOf('const element = document.querySelector') !== -1){
                        cmd = cmd.replace('const element = document.querySelector', 'cy.get');
                        cmd = cmd.replace(');', ')');
                        cmd = cmd.replace(
                            'const content = (element.textContent || element.innerText || element.value || \'\');\n' +
                            'return content ',
                            '.textContent ');
                        cmd = addIfCommandThrowException(cmd);
                        cmd = cmd.replace(';)', ')');
                        addLine(cmd);
                        return;
                    }
                    if(cmd.indexOf('const content = (element.textContent || element.innerText || element.value') !== -1){
                        cmd = cmd.replace('const element = document.querySelector', 'cy.get');
                        cmd = cmd.replace(');', ')');
                        cmd = cmd.replace(
                            'const content = (element.textContent || element.innerText || element.value || \'\');\n' +
                            'return content !== ',
                            '.textContent.indexOf(');
                        cmd = cmd.replace(';', '');
                        cmd = cmd + ");";
                        cmd = cmd.replace("'${", '`${');
                        cmd = cmd.replace("}'", '}`) === -1');
                        cmd = addIfCommandThrowException(cmd);
                        addLine(cmd);
                        return;
                    }
                    if(cmd.indexOf("window.location.href =") === 0){
                        let url = cmd.substring(cmd.indexOf(" = ") + 3);
                        url = str.replaceQuotesWithBackTicks(url);
                        url = url.replace(";", "");
                        if(!url || url === ''){
                            url = "initialUrl";
                        }
                        addLineWithThen(`cy.visit(${url})`);
                        return;
                    }
                    cmd = cmd.replace(/\\"/g, '');
                    if(value === "checkReturnValue"){
                        cmd = cmd
                            .replace(/"\${/g, '')
                            .replace(/}"/g, '')
                            .replace(/\${/g, '')
                            .replace(/}/g, '');
                        cmd = cmd.replace("return ", '');
                        cmd = cmd.replace(";", '');
                        cmd = cmd.replace(/"/g, '`');
                        cmd = addIfCommandThrowException(cmd);
                        addLine(cmd);
                        return;
                    }
                    cmd = cmd.replace("return ", "let " + value + " = ");
                    cmd = cmd.replace("document.querySelector", "cy.get");
                    cmd = str.stripLiteralBrackets(cmd);
                    addLine(cmd);
                },
                click: function(){
                    //cy.click(step.target);
                    let line = step.target;
                    line = line.replace("css=", "");
                    if(line.indexOf("${") !== -1){
                        line = "cy.get(`" + line + "`).click({force: true})";
                    }else{
                        line = "cy.get('" + line + "').click({force: true})";
                    }
                    addLineWithThen(line);
                },
                pause: function(){
                    addLine(`cy.wait(5000)`);
                    //code += `//cy.wait(${step.target})`
                },
                type: function(){
                    let selector = step.target.replace("css=", "");
                    let toType = step.value;
                    if(selector.indexOf('input[name') !== -1){
                        //debugger;
                    }
                    if(selector.indexOf("$") === -1){
                        selector = "'" + selector + "'";
                    }else{
                        selector = selector.replace('${', '}');
                    }
                    if(toType.indexOf("$") === -1){
                        toType = '"' + toType + '"';
                    }else{
                        toType = toType.replace('${', '').replace("}", '');
                    }
                    let line = 'cy.get(' + selector + ').type(' + toType + ', {force: true})';
                    addLineWithThen(line);
                },
                setWindowSize: function(){
                    addLine(` //${step.command} not implemented...`);
                },
                assert: function(){
                    console.log("should be handled earlier");
                },
                sendKeys: function(){
                    let key = step.value.replace("${KEY_", "{").toLowerCase();
                    let selector = step.target.replace("css=", "");
                    addLine(`cy.get('${selector}').type("${key}", {force: true})`);
                },
                assertElementPresent: function(){
                    let selector = step.target.replace("css=", "");
                    addLine(`cy.get("${selector}").should('exist')`);
                },
                verifyElementPresent: function(){
                    handlers.assertElementPresent();
                },
                assertElementNotPresent: function(){
                    let selector = step.target.replace("css=", "");
                    addLine(`cy.get("${selector}").should('not.exist')`);
                },
                verifyElementNotPresent: function(){
                    handlers.assertElementNotPresent();
                },
                dragAndDropToObject: function(){
                    console.error("dragAndDropToObject not implemented", step);
                }
            };
            if(typeof handlers[step.command] === "undefined"){
                throw "Please implement handler for command " + step.command;
            }
            handlers[step.command]();
        });
        code = code.replace(/&debug=\${debugMode}/g, "");
        function getPath(){
            let name = seleniumTest.name;
            name = str.slugify(name);
            name = name.toLowerCase()
                .replace(/-/g, '_')
                .replace(/ /g, '_')
                .replace(/,/g, '_')
                .replace(/__/g, '_')
                .replace(/_-_/g, '_')
                .replace(/\(/g, '')
                .replace(/\)/g, '');
            name = name + "_spec.js";
            return baseOutputFolder + "/" + name;
        }
        let path = getPath();
        code =
            '// load type definitions that come with Cypress module\n' +
            '/// <reference types="cypress" />\n' +
            globalVariables +
            "let selectors = " + JSON.stringify(selectors, null, 2) + ";\n" +
            'describe(\'' + seleniumTest.name + '\', function(){\n' +
            '    it.only(\'' + seleniumTest.name + '\', function(){' +
            code +
            closingTags +
            '    });\n' +
            '});\n';
        code = beautify(code, {
            indent_size: 4,
            space_in_empty_paren: false,
            brace_style: "expand,preserve-inline",
            //preserve_newlines: false,
            //max_preserve_newlines: 0
        });
        code = code.replace(/;;/g, ';');
        code = code.replace(/'https:\/\/staging.quantimo.do/g, "apiUrl +'");
        fileHelper.writeToFile(path, code);
    }
    let seleniumTests = fs.readFileSync('./' + seleniumTestPath);
    seleniumTests = JSON.parse(seleniumTests);
    seleniumTests.tests.forEach(function(seleniumTest){
        generateOneCypressTest(seleniumTest);
    });
}
exports.convertSeleniumToCypress = convertSeleniumToCypress;