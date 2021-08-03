# react-native-webview-comlink ![Node.js CI](https://github.com/rocwind/react-native-webview-comlink/workflows/Node.js%20CI/badge.svg)

`react-native-webview-comlink`'s goal is to integrate the [Comlink](https://github.com/GoogleChromeLabs/comlink) with React Native WebView component, exposes native API to the WebView

## Install

-   Install the package: `npm i --save react-native-webview-comlink`

## Usage

### Native

```
import { WebView } from 'react-native-webview';
import { withComlinkExpose } from 'react-native-webview-comlink';

// root api object for web side to call
const rootObj = {
    someMethod() {
        console.warn('someMethod called');
    },
    someMethodWithCallbackSupport(cb) {
        cb('invoke callback from native');
    }
};
const WebViewComponent = withComlinkExpose(rootObj, 'MyJSInterface')(WebView);

// render with the <WebViewComponent />
```

### Web

```
// call native side method
MyJSInterface.someMethod();

// callbacks are supported
MyJSInterface.someMethodWithCallbackSupport((msg) => {
    console.log(msg);
});
```

## Examples

There are example [React Native project](examples/native) and [Web project(React)](examples/web) in [examples directory](examples)

## API

### Native

#### `withComlinkExpose(obj, name, options)(WebView)`

> Returns a higher-order React WebView component class that has `obj` exposed as `name` via `comlink`.

-   [`options`] _(Object)_: if specified, customized the behavior of the higher-order WebView component.
    -   [`forwardRef`] _(Boolean)_: forward ref to the wrapped component, default is `false`
    -   [`whitelistURLs`] _(String or RegExp Array)_: white list urls where `Comlink` enabled, default is `null`
    -   [`isEnabled`] _(Function)_: for control Comlink enable or disable status, it gets called in sending and receiving each message, returns `true` to let the message pass, default is `null`
    -   [`injectOnLoadStart`] _(Boolean)_: inject the `obj` on load start on Android, default is `false` - inject on load end
    -   [`log`] _(Boolean)_: print debug log to console, default is `false`

### Web

Just call methods on window.`name`

## Compatibility

`Comlink` depends on some ES6+ features such as:

-   [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
-   [Generator Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)
-   [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol).

Latest React Native project (0.64.0+) should have no problem to support it, while 0.63.x and before may need [proxy-polyfill](https://github.com/GoogleChrome/proxy-polyfill) to [work with Hermes](https://github.com/facebook/hermes/issues/33)

It is compatible with RN support platforms: Android 5.0+, iOS 10+ (depends on the system WebView features)

However, to work with Android 5 stock Chrome browser (System browser can be updated to latest since Android 5, but in case there are devices that keeps using browser before Chrome 49 - Android 5 default is 38), you may need following polyfill libraries included on web page to get it work:

-   [core-js] https://github.com/zloirock/core-js
-   [proxy-polyfill] https://github.com/GoogleChrome/proxy-polyfill

## Upgrade from v0.5.x to v0.6.x

### About the 0.6.x changes

-   The message channel protocol keeps compatible between 0.6.x and 0.5.x. So it should be no problem to upgrade either native or web side first. One of the reason for 0.6.0 api change is to get the future upgrade (may adjust the message protocol) more smooth by eliminate the dependency of this lib at web side.
-   The exposed `obj` are assumed to be object that have functions as its properties, the function parameters that type are function are auto proxied in 0.6.x.

### Native

-   uninstall the `comlinkjs` npm package.
-   update `withComlinkExpose`, add a `name` param, and rename its option (if used) `whitelistUrls` to `whitelistURLs`

### Web - does not need to be compatible with app that runs v0.5.x

-   uninstall the `comlinkjs` npm package.
-   uninstall this npm package `react-native-webview-comlink`, replace previous proxyObj with window.`name` (native side defined name)

### Web - need to be compatible with app that runs v0.5.x

-   keep using v0.5.x at web side until compatibility is no longer a problem.
