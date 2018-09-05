"use strict";

var should = require('chai').should(),
    webdriver = require('webdriverio'),
    assert = require("assert");

describe('OpenFin with webdriver.io', function () {

    function switchToWindow(title) {
        var tabIds = browser.getTabIds();
        var i;
        for (i = 0; i < tabIds.length; i++) {
            if (browser.window(tabIds[i]).getTitle() === title) {
                browser.switchTab(tabIds[i]);
                return;
            }
        }

        //didn't find the window, wait a sec and try again
        browser.pause(1000);

        switchToWindow(title);
    }

    function checkFinGetVersion() {
        return browser.execute(function () {
            if (fin && fin.desktop && fin.desktop.System && fin.desktop.System.getVersion) {
                return true;
            } else {
                return false;
            }
        });
    }

    function waitForFinDesktop(readyCallback) {
        if (checkFinGetVersion()) {
            readyCallback();
        }
        else {
            browser.pause(1000);
            waitForFinDesktop(readyCallback);
        }
    }

    it("Verify openfin version", ()=>{
        should.exist(browser);

        waitForFinDesktop(()=>{
            var result = browser.executeAsync((callback)=>{
                fin.desktop.System.getVersion((v)=>{
                    callback(v);
                });
            });

            //verify version number matches.
            should.equal(result.value, "9.61.33.32",);
        });
    });

    it("Switch to login window", () => {
        should.exist(browser);
        switchToWindow("openfin_selenium_login");
    });

    it("Login", () => {
        should.exist(browser);
        browser.setValue("#openfin_username", "openfin_selenium");
        browser.setValue("#openfin_password", "test1234");
        browser.click("#btnLogin");
        browser.pause(1000); //after clicking on the login button, it closes the login window, without the pause, switchToWindow call will fail 
    });

    it("Switch to launch bar", () => {
        should.exist(browser);
        switchToWindow("openfin_selenium_launch_bar");
    });

    it("Launch Google", () => {
        should.exist(browser);
        browser.click("#btnGoogle");
    });

    it("Switch to Google", () => {
        should.exist(browser);
        switchToWindow("Google");
    });

    it("Close the application", ()=>{
        should.exist(browser);
        browser.pause(5000);
        browser.execute(()=>{
            fin.desktop.Application.getCurrent().close();
        });
    });

});
