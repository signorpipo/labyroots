PP.XRUtils = {
    isDeviceEmulated: function () {
        let isEmulated = ('CustomWebXRPolyfill' in window);
        return isEmulated;
    },
    isSessionActive: function () {
        return WL.xrSession != null;
    },
    isReferenceSpaceLocalFloor: function () {
        return !["local", "viewer"].includes(WebXR.refSpace);
    },
    openLink(url, newTab = true, exitXRSessionBeforeOpen = true, exitXRSessionOnSuccess = true, tryOpenLinkOnClickOnFailure = false, onSuccessCallback = null, onFailureCallback = null) {
        let element = document.createElement("a");

        element.style.display = "none";

        document.body.appendChild(element);

        element.addEventListener("click", function () {
            let targetPage = undefined;
            if (newTab) {
                targetPage = "_blank";
            }

            let result = window.open(url, targetPage);

            if (result != null) {
                if (!exitXRSessionBeforeOpen && exitXRSessionOnSuccess) {
                    if (WL.xrSession) {
                        try {
                            WL.xrSession.end();
                        } catch (error) {
                            // Do nothing
                        }
                    }
                }

                if (onSuccessCallback != null) {
                    onSuccessCallback();
                }
            } else {
                if (tryOpenLinkOnClickOnFailure) {
                    setTimeout(function () {
                        PP.XRUtils.openLinkOnClick(url, newTab, exitXRSessionOnSuccess, onSuccessCallback, onFailureCallback);
                    }, 100);
                } else if (onFailureCallback != null) {
                    onFailureCallback();
                }
            }
        });

        if (exitXRSessionBeforeOpen) {
            if (WL.xrSession) {
                try {
                    WL.xrSession.end();
                } catch (error) {
                    // Do nothing
                }
            }
        }

        element.click();

        document.body.removeChild(element);
    },
    openLinkOnClick(url, newTab = true, exitXRSessionOnSuccess = true, onSuccessCallback = null, onFailureCallback = null) {
        document.addEventListener("click", function () {
            let targetPage = undefined;
            if (newTab) {
                targetPage = "_blank";
            }

            let result = window.open(url, targetPage);

            if (result != null) {
                if (exitXRSessionOnSuccess) {
                    if (WL.xrSession) {
                        try {
                            WL.xrSession.end();
                        } catch (error) {
                            // Do nothing
                        }
                    }
                }

                if (onSuccessCallback != null) {
                    onSuccessCallback();
                }
            } else {
                if (onFailureCallback != null) {
                    onFailureCallback();
                }
            }
        }, { once: true });
    }
};