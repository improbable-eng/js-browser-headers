import BrowserHeaders from "../src/BrowserHeaders";

const { deepEqual } = require("assert");

declare function describe(name: string, test: () => void): void;
declare function it(name: string, test: () => void): void;

// Declare that there is a global property named "Headers"
declare const Headers: any;

interface Map<K, V> {
  clear(): void;
  delete(key: K): boolean;
  forEach(callbackfn: (value: V, index: K, map: Map<K, V>) => void, thisArg?: any): void;
  get(key: K): V | undefined;
  has(key: K): boolean;
  set(key: K, value?: V): this;
  readonly size: number;
}

interface MapConstructor {
  new (): Map<any, any>;
  new <K, V>(entries?: [K, V][]): Map<K, V>;
  readonly prototype: Map<any, any>;
}

declare const Map: MapConstructor;

describe("browser-headers", () => {
  it("should parse a CLRF-delimited header string", () => {
    const browserHeaders = new BrowserHeaders("keya: one\r\nkeyb: Two\r\nkeyC: three");
    deepEqual(browserHeaders.get("keyA"), ["one"]);
    deepEqual(browserHeaders.get("keyB"), ["Two"]);
    deepEqual(browserHeaders.get("keyC"), ["three"]);
  });

  it("should construct from an object", () => {
    const browserHeaders = new BrowserHeaders({
      "keyA": ["one", "Two"],
      "keyb": "three"
    });
    deepEqual(browserHeaders.get("keyA"), ["one", "Two"]);
    deepEqual(browserHeaders.get("keyB"), ["three"]);
  });

  it("should construct from an instance of BrowserHeaders", () => {
    const toInit = new BrowserHeaders({
      "keyA": ["one", "Two"],
      "keyb": "three"
    });

    const browserHeaders = new BrowserHeaders(toInit);
    deepEqual(browserHeaders.get("keyA"), ["one", "Two"]);
    deepEqual(browserHeaders.get("keyB"), ["three"]);
  });

  it("should retain multiple values for a single key", () => {
    const browserHeaders = new BrowserHeaders();
    browserHeaders.append("keyA", "one");
    browserHeaders.append("keyA", "Two");
    deepEqual(browserHeaders.get("keyA"), ["one", "Two"]);
  });

  describe("set", () => {
    it("should set an individual value", () => {
      const browserHeaders = new BrowserHeaders();
      browserHeaders.set("keyA", "one");
      deepEqual(browserHeaders.get("keyA"), ["one"]);
      browserHeaders.set("keyA", "Two");
      deepEqual(browserHeaders.get("keyA"), ["Two"]);
    });

    it("should set an array of values", () => {
      const browserHeaders = new BrowserHeaders();
      browserHeaders.set("keyA", ["one", "Two"]);
      deepEqual(browserHeaders.get("keyA"), ["one", "Two"]);
      browserHeaders.set("keyA", ["three", "four"]);
      deepEqual(browserHeaders.get("keyA"), ["three", "four"]);
    });
  });

  describe("append", () => {
    it("should append an individual value", () => {
      const browserHeaders = new BrowserHeaders();
      browserHeaders.append("keyA", "one");
      browserHeaders.append("keyA", "Two");
      deepEqual(browserHeaders.get("keyA"), ["one", "Two"]);
    });

    it("should append an array of values", () => {
      const browserHeaders = new BrowserHeaders();
      browserHeaders.append("keyA", ["one", "Two"]);
      browserHeaders.append("keyA", ["three", "four"]);
      deepEqual(browserHeaders.get("keyA"), ["one", "Two", "three", "four"]);
    });
  });

  describe("appendFromString", () => {
    it("should parse the headers string", () => {
      const browserHeaders = new BrowserHeaders();
      browserHeaders.appendFromString("keya: one\r\nkeyb: Two\r\nkeyC: three");
      deepEqual(browserHeaders.get("keyA"), ["one"]);
      deepEqual(browserHeaders.get("keyB"), ["Two"]);
      deepEqual(browserHeaders.get("keyC"), ["three"]);
    });

    it("should append to existing values", () => {
      const browserHeaders = new BrowserHeaders();
      browserHeaders.append("keyA", ["one", "Two"]);
      browserHeaders.append("keyB", "four");
      browserHeaders.appendFromString("keya: three\r\nkeyb: Five\r\nkeyC: six");
      deepEqual(browserHeaders.get("keyA"), ["one", "Two", "three"]);
      deepEqual(browserHeaders.get("keyb"), ["four", "Five"]);
      deepEqual(browserHeaders.get("keyC"), ["six"]);
    });
  });

  describe("delete", () => {
    it("should remove a key", () => {
      const browserHeaders = new BrowserHeaders();
      browserHeaders.append("keyA", ["one", "Two"]);
      deepEqual(browserHeaders.get("keyA"), ["one", "Two"]);
      browserHeaders.delete("keyA");
      deepEqual(browserHeaders.get("keyA"), []);
    });

    it("should not throw an error when removing a key that is not present", () => {
      const browserHeaders = new BrowserHeaders();
      browserHeaders.delete("keyA");
    });

    it("should remove a value within a key", () => {
      const browserHeaders = new BrowserHeaders();
      browserHeaders.append("keyA", ["one", "Two", "three"]);
      deepEqual(browserHeaders.get("keyA"), ["one", "Two", "three"]);
      browserHeaders.delete("keyA", "Two");
      deepEqual(browserHeaders.get("keyA"), ["one", "three"]);
    });

    it("should not throw an error when removing a value of a key that is not present", () => {
      const browserHeaders = new BrowserHeaders();
      browserHeaders.delete("keyA", "Two");
    });

    it("should not throw an error when removing a non-existant value of a key that is present", () => {
      const browserHeaders = new BrowserHeaders();
      browserHeaders.append("keyA", ["one", "three"]);
      browserHeaders.delete("keyA", "Two");
    });
  });

  describe("has", () => {
    it("should return true for an existing key", () => {
      const browserHeaders = new BrowserHeaders();
      browserHeaders.append("keyA", ["one", "Two"]);
      deepEqual(browserHeaders.get("keyA"), ["one", "Two"]);
      deepEqual(browserHeaders.has("keyA"), true);
    });

    it("should return false for a non-existing key", () => {
      const browserHeaders = new BrowserHeaders();
      deepEqual(browserHeaders.has("keyA"), false);
    });

    it("should return true for an existing value", () => {
      const browserHeaders = new BrowserHeaders();
      browserHeaders.append("keyA", ["one", "Two"]);
      deepEqual(browserHeaders.has("keyA", "Two"), true);
    });

    it("should return false for a non-existing value within a key", () => {
      const browserHeaders = new BrowserHeaders();
      browserHeaders.append("keyA", ["one", "Two"]);
      deepEqual(browserHeaders.has("keyA", "three"), false);
    });

    it("should return false for a value within a non-existant key", () => {
      const browserHeaders = new BrowserHeaders();
      deepEqual(browserHeaders.has("keyA", "three"), false);
    });

    it("should return false for a key that was deleted", () => {
      const browserHeaders = new BrowserHeaders();
      browserHeaders.append("keyA", ["one", "Two"]);
      browserHeaders.delete("keya");
      deepEqual(browserHeaders.has("keyA"), false);
    });

    it("should return false for a key that was deleted by emptying it's keys", () => {
      const browserHeaders = new BrowserHeaders();
      browserHeaders.append("keyA", ["one", "Two"]);
      browserHeaders.delete("keya", "one");
      browserHeaders.delete("keya", "Two");
      deepEqual(browserHeaders.has("keyA"), false);
    });
  });

  describe("forEach", () => {
    it("should append an individual value", () => {
      const browserHeaders = new BrowserHeaders();
      browserHeaders.append("keyA", ["one", "Two"]);
      browserHeaders.append("keyB", ["three", "four"]);
      const visited: string[] = [];
      browserHeaders.forEach((key, values) => {
        visited.push(key + "." + values.join(","));
      });
      deepEqual(visited, [
        "keya.one,Two",
        "keyb.three,four",
      ]);
    });
  });

  // Can only test the Headers compatibility if there is a Headers class in this browser
  if (typeof Headers !== "undefined") {
    describe("Headers-compatibility", () => {
      it("should construct a BrowserHeaders from a Headers instance and not split the values by default", () => {
        const headers = new Headers();
        headers.append("keyA", "one, Two");
        headers.append("keyB", "three");

        const browserHeaders = new BrowserHeaders(headers);
        deepEqual(browserHeaders.get("keyA"), ["one, Two"]);
        deepEqual(browserHeaders.get("keyB"), ["three"]);
      });

      it("should construct a BrowserHeaders from a Headers instance and split the values if specified (comma)", () => {
        const headers = new Headers();
        headers.append("keyA", "one,Two");
        headers.append("keyB", "three");

        const browserHeaders = new BrowserHeaders(headers, {splitValues: true});
        deepEqual(browserHeaders.get("keyA"), ["one", "Two"]);
        deepEqual(browserHeaders.get("keyB"), ["three"]);
      });

      it("should construct a BrowserHeaders from a Headers instance and split the values if specified (comma + space)", () => {
        const headers = new Headers();
        headers.append("keyA", "one, Two");
        headers.append("keyB", "three");

        const browserHeaders = new BrowserHeaders(headers, {splitValues: true});
        deepEqual(browserHeaders.get("keyA"), ["one", "Two"]);
        deepEqual(browserHeaders.get("keyB"), ["three"]);
      });

      /* This test uses separate append calls for `keyA`, which in some browsers joins the strings with a comma. By
       setting splitValues to true, this test checks that this browser-specific detail can be abstracted. */
      it("should construct a BrowserHeaders from a Headers instance and split the values if specified - separate appends", () => {
        const headers = new Headers();
        headers.append("keyA", "one");
        headers.append("keya", "Two");
        headers.append("keyB", "three");

        const browserHeaders = new BrowserHeaders(headers, {splitValues: true});
        deepEqual(browserHeaders.get("keyA"), ["one", "Two"]);
        deepEqual(browserHeaders.get("keyB"), ["three"]);
      });
    });
  }

  // Can only test the Map compatibility if there is a Map class in this browser
  if (typeof Map !== "undefined") {
    describe("Headers-compatibility", () => {
      it("should construct a BrowserHeaders from a Map", () => {
        const map = new Map<string, string|string[]>();
        map.set("keyA", ["one", "Two"]);
        map.set("keyB", "three");

        const browserHeaders = new BrowserHeaders(map);
        deepEqual(browserHeaders.get("keyA"), ["one", "Two"]);
        deepEqual(browserHeaders.get("keyB"), ["three"]);
      });
    });
  }
});