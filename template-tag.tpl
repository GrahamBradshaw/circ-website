// Copyright 2026 YANDEX LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

___TERMS_OF_SERVICE___

By creating or modifying this file you agree to Google Tag Manager's Community
Template Gallery Developer Terms of Service available at
https://developers.google.com/tag-manager/gallery-tos (or such other URL as
Google may provide), as modified from time to time.


___INFO___

{
  "type": "TAG",
  "id": "yandex_webmaster_verification",
  "version": 1,
  "securityGroups": [],
  "displayName": "Official Yandex Webmaster",
  "brand": {
    "id": "yandex",
    "displayName": "Yandex",
    "thumbnail": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADpElEQVR4nN2Wz2sUZxjHv8/MrGt2Na7U1DHFYgtroVRpqTZ5MwqDBEsaltZD8MfBg4dcSumlChVady8V1JO0/0ApGumlrZogRFga9xcthWoRZKEKIUGSSOLquplm9n16SDbMbGZmdcr24HvafX58v5/Z932fWeBlWPuF+EAIcSJMr/JfjIeHhyOG6PnWZlki4teduVQqFWs7wF+3b5+WjE8BgEi97Mw9mp09bRg9H7UNoL+/fxMIX2LZ/Y9cLnfPVUB8lCXOtQ3AqlbfZeYoABC4ahjGnkZu377eHma8yYy3DcPYGKSjhQWwgfWNz8zYz3X7N9HbWyYFl2Sdd66kKBKJxAE88dOhsACmaW6xFmuzLcoeFoqlbUEFobcgm83OgfB9sDiFPwNsmi23R9PWfQGAvXIEGunevv1iKy3PLSgn9DRYCm1z7OM3HjxY9Gs2jN4BWefRVTEiG+BrIFzJ50sjAHB/x4719vyzn0FKIbnwML3mIbzMWcozAGAv1M4D+MwPQEocdkf4er5QOuSM2Au188w4CJYHywkdzRCuLXCaE9GdeEzN+JkPDAxEwfyJyx7Klea6eEzNENEdAGApz5QTujfAGvO4eqB7enrOD6BSmf8QwKbVAFEtGo1eba7rnp6ei8fVA34QShjzZSE+4vxO4OvZbPapV20QhBLGfEiIDoBSriBhJKjHD0KBlK5rVJWy5XCaIhpk5g2r3kRPX2NlNKjHU1tKVpKVmQwBaQBg5l2o8c2yrncFKnHddfoZ+OXHQqEW1FLW9S7U+CYz7wIAAtLJykxGAYAXgTBNcwODBp0xRcGa0/885oDjFjwvhGVZKTB3OEKPOzs33whj7gLwguBF/qpZkCDdw4fop7GxMcv38Rf5az9zwGMSJiszmXLnqwBBaImOU1hYjgshji6b06Bz/Lf6+bVEx0l7/lkSjEKz+QqU92LT1CibtYeGhtSpyckfGO573yjTIuu2TkxMBL6WG1peOd+3YaNhamrycx9zACDb/udCkLlT64UAGoslnwwuwHHTNLe00gkFYJqmDkAHABBdIoUyAJWb6yzLer8tAEtLS1WsnDhVxcV8vpguFIs7FVXbS4RfG3VEFDiEQgPkcrknRLhLhL9v3SqWHPHfAdq4Ym7FYrE/wwK0/NtFCk5xnYQzZhjGW7JuvwcAYJwdHx9/HBag5SHM5Uqjr3R1nXXGpLSPAYBC+O6d3bu/CWseegkhTvT19e39343bsf4F9ZK9nwsZ44QAAAAASUVORK5CYII\u003d"
  },
  "description": "Adds the Yandex Webmaster verification meta tag to the head of your site homepage.",
  "categories": [
    "ANALYTICS"
  ],
  "containerContexts": [
    "WEB"
  ]
}


___TEMPLATE_PARAMETERS___

[
  {
    "type": "TEXT",
    "name": "verificationId",
    "displayName": "Webmaster verification ID",
    "simpleValueType": true,
    "help": "Paste the value from the content attribute of the Yandex Webmaster verification meta tag.",
    "valueValidators": [
      {
        "type": "NON_EMPTY"
      }
    ]
  }
]


___SANDBOXED_JS_FOR_WEB_TEMPLATE___

const injectScript = require('injectScript');
const makeString = require('makeString');
const queryPermission = require('queryPermission');
const setInWindow = require('setInWindow');

const GLOBAL_NAMESPACE = 'yandexWebmasterVerification';
const HELPER_SCRIPT_URL =
    'https://cdn.jsdelivr.net/gh/yandex/webmaster-gtm-template@467fdc0c3ab3124a40ddf229fc8cd20392c71938/webmaster-verification.js';

const verificationId = makeString(data.verificationId || '').trim();

if (!verificationId) {
  data.gtmOnFailure();
  return;
}

if (!queryPermission('access_globals', 'readwrite', GLOBAL_NAMESPACE) ||
    !queryPermission('inject_script', HELPER_SCRIPT_URL)) {
  data.gtmOnFailure();
  return;
}

if (!setInWindow(GLOBAL_NAMESPACE, {token: verificationId}, true)) {
  data.gtmOnFailure();
  return;
}

injectScript(
    HELPER_SCRIPT_URL,
    data.gtmOnSuccess,
    data.gtmOnFailure);


___WEB_PERMISSIONS___

[
  {
    "instance": {
      "key": {
        "publicId": "access_globals",
        "versionId": "1"
      },
      "param": [
        {
          "key": "keys",
          "value": {
            "type": 2,
            "listItem": [
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "yandexWebmasterVerification"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": false
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  },
  {
    "instance": {
      "key": {
        "publicId": "inject_script",
        "versionId": "1"
      },
      "param": [
        {
          "key": "urls",
          "value": {
            "type": 2,
            "listItem": [
              {
                "type": 1,
                "string": "https://cdn.jsdelivr.net/gh/yandex/webmaster-gtm-template@467fdc0c3ab3124a40ddf229fc8cd20392c71938/webmaster-verification.js"
              }
            ]
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  }
]


___TESTS___

scenarios:
- name: Injects helper script after setting verification ID
  code: |-
    mock('queryPermission', function() {
      return true;
    });

    let injectCalls = [];
    mock('injectScript', function(url, onSuccess) {
      injectCalls.push(url);
      onSuccess();
    });

    const mockData = {
      verificationId: 'abc123'
    };

    runCode(mockData);

    assertApi('setInWindow').wasCalledWith('yandexWebmasterVerification', {
      token: 'abc123'
    }, true);
    assertThat(injectCalls).isEqualTo([
      'https://cdn.jsdelivr.net/gh/yandex/webmaster-gtm-template@467fdc0c3ab3124a40ddf229fc8cd20392c71938/webmaster-verification.js'
    ]);

    assertApi('gtmOnSuccess').wasCalled();
    assertApi('gtmOnFailure').wasNotCalled();
- name: Fails when verification ID is empty
  code: |-
    const mockData = {
      verificationId: ''
    };

    runCode(mockData);

    assertApi('injectScript').wasNotCalled();
    assertApi('gtmOnSuccess').wasNotCalled();
    assertApi('gtmOnFailure').wasCalled();
- name: Trims whitespace around verification ID
  code: |-
    mock('queryPermission', function() {
      return true;
    });

    let injectCalls = [];
    mock('injectScript', function(url, onSuccess) {
      injectCalls.push(url);
      onSuccess();
    });

    const mockData = {
      verificationId: '  abc123  '
    };

    runCode(mockData);

    assertApi('setInWindow').wasCalledWith('yandexWebmasterVerification', {
      token: 'abc123'
    }, true);
    assertThat(injectCalls).isEqualTo([
      'https://cdn.jsdelivr.net/gh/yandex/webmaster-gtm-template@467fdc0c3ab3124a40ddf229fc8cd20392c71938/webmaster-verification.js'
    ]);

    assertApi('gtmOnSuccess').wasCalled();
    assertApi('gtmOnFailure').wasNotCalled();
- name: Fails when helper script injection is not permitted
  code: |-
    mock('queryPermission', function(permission) {
      return permission !== 'inject_script';
    });

    const mockData = {
      verificationId: 'abc123'
    };

    runCode(mockData);

    assertApi('injectScript').wasNotCalled();
    assertApi('gtmOnSuccess').wasNotCalled();
    assertApi('gtmOnFailure').wasCalled();
- name: Fails when token cannot be saved to window
  code: |-
    mock('queryPermission', function() {
      return true;
    });
    mock('setInWindow', function() {
      return false;
    });

    const mockData = {
      verificationId: 'abc123'
    };

    runCode(mockData);

    assertApi('injectScript').wasNotCalled();
    assertApi('gtmOnSuccess').wasNotCalled();
    assertApi('gtmOnFailure').wasCalled();


___NOTES___

Created on 31.03.2026

