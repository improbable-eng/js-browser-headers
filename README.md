# browser-headers
> Compatibility Layer for the Headers class

The [Headers](https://fetch.spec.whatwg.org/#headers-class) class defined in the [fetch spec](https://fetch.spec.whatwg.org/) has been implemented slightly differently across browser vendors at the time of writing (Feb 2017).

This package intends to provide a wrapper for the `Headers` class to ensure a consistent API and provides headers parsing from CLRF-delimited strings.

This package is written in TypeScript, but is designed to be used just as easily by JavaScript projects.

[![build status](https://secure.travis-ci.org/improbable-eng/js-browser-headers.png)](https://travis-ci.org/improbable-eng/js-browser-headers)

## Installation
via npm as an ES5/ES6 module:

```bash
$ npm install browser-headers
```

## Browser Support
This library is tested against Chrome, Safari, Firefox, Edge, IE 10 and IE 8.

## API

```js
import BrowserHeaders from 'browser-headers';

const headers = new BrowserHeaders({
  "content-type": "application/json",
  "my-header": ["value-one","value-two"]
});

headers.forEach((key, values) => {
  console.log(key, values);
});

// Outputs:
// "content-type", ["application/json"]
// "my-header", ["value-one","value-two"]
```

The `BrowserHeaders` class can be constructed from one of:
* An instance of `Headers`
* A CLRF-delimited string (e.g. `key-a: one\r\nkey-b: two`)
* An instance of `BrowserHeaders`
* An object consisting of `string->(string|string[])` (e.g. `{"key-a":["one","two"],"key-b":"three"}`) 
* A `Map<string, string|string[]>`

The `BrowserHeaders` class has the following methods:

#### .get(key: string): string[]
Returns all of the values for that header `key` as an array

#### .forEach(callback: (key: string, values: string[]) => void): void
Invokes the provided callback with each key and it's associated values as an array

#### .set(key: string, values: string|string[]): void
Overwrites the `key` with the value(s) specified.

#### .append(key: string, values: string|string[]): void
Appends the value(s) to specified `key`.

#### .delete(key: string, value: string): void
If the `value` is specified: 
    Removes the specified `value` from the `key` if it is present.
Otherwise:
    Removes all values for the `key` if it is present.

#### .has(key: string, value?: string): boolean
If the value is specified: 
    Returns true if the `key` contains the corresponding `value`.
Otherwise:
    Returns true if the `key` has at least one value.

#### .appendFromString(str: string): void
Appends the headers defined in the provided CLRF-delimited string (e.g. `key-a: one\r\nkey-b: two`)