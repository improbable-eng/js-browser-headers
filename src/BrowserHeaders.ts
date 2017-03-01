import { normalizeName, normalizeValue } from "./util";

// Declare the class that *might* be present in the browser
export declare interface WindowHeaders {
  get(key: string): string[]; // in some browsers .get returns a single string
  getAll(key: string): string[]; // some browsers don't have a .getAll
  has(key: string): boolean;
  delete(key: string): void;
  keys(): any;
  entries(): any;
  forEach(callback: (value: string, key: string) => void): any;
  append(key: string, value: string): void;
  set(key: string, value: string): void;
  [Symbol.iterator]: () => Iterator<string>,
}

// Declare that there is a global property named "Headers" - this might not be present at runtime
declare const Headers: any;

// getHeadersValues abstracts the difference between get() and getAll() between browsers and always returns an array
function getHeaderValues(headers: WindowHeaders, key: string): string[] {
  if (headers instanceof Headers && headers.getAll) {
    // If the headers instance has a getAll function then it will return an array
    return headers.getAll(key);
  }

  // There is no getAll() function so get *should* return an array
  const getValue = headers.get(key);
  if (getValue && typeof getValue === "string") {
    // some .get() implementations return a string even though they don't have a .getAll() - notably Microsoft Edge
    return [getValue];
  }
  return getValue;
}

// getHeaderKeys returns an array of keys in a headers instance
function getHeaderKeys(headers: WindowHeaders): string[] {
  const asMap: {[key: string]: boolean} = {};
  const keys: string[] = [];

  if (headers.keys) {
    for (let key of headers.keys()) {
      if (!asMap[key]) {
        // Only add the key if it hasn't been added already
        asMap[key] = true;
        keys.push(key);
      }
    }
  } else if (headers.forEach) {
    headers.forEach((_, key) => {
      if (!asMap[key]) {
        // Only add the key if it hasn't been added already
        asMap[key] = true;
        keys.push(key);
      }
    });
  } else {
    // If keys() and forEach() aren't available then fallback to iterating through headers
    for (let entry of headers) {
      const key = entry[0];
      if (!asMap[key]) {
        // Only add the key if it hasn't been added already
        asMap[key] = true;
        keys.push(key);
      }
    }
  }
  return keys;
}

function splitHeaderValue(str: string) {
  const values: string[] = [];
  const commaSpaceValues = str.split(", ");
  commaSpaceValues.forEach(commaSpaceValue => {
    commaSpaceValue.split(",").forEach(commaValue => {
      values.push(commaValue);
    });
  });
  return values;
}

export type HeaderObject = {[key: string]: string|string[]};
export type HeaderMap = Map<string, string|string[]>;

// BrowserHeaders is a wrapper class for Headers
export default class BrowserHeaders {
  keyValueMap: {[key: string]: string[]};

  constructor(init: HeaderObject | HeaderMap | BrowserHeaders | WindowHeaders | string = "", options: {splitValues: boolean} = { splitValues: false } ) {
    this.keyValueMap = {};

    if (init) {
      if (typeof Headers !== "undefined" && init instanceof Headers) {
        const keys = getHeaderKeys(init as WindowHeaders);
        keys.forEach(key => {
          const values = getHeaderValues(init as WindowHeaders, key);
          values.forEach(value => {
            if (options.splitValues) {
              this.append(key, splitHeaderValue(value));
            } else {
              this.append(key, value);
            }
          });
        });
      } else if (init instanceof BrowserHeaders) {
        init.forEach((key, values) => {
          this.append(key, values)
        });
      } else if (typeof Map !== "undefined" && init instanceof Map) {
        const asMap = init as HeaderMap;
        asMap.forEach((value: string|string[], key: string) => {
          this.append(key, value);
        });
      } else if (typeof init === "string") {
        this.appendFromString(init);
      } else if (typeof init === "object") {
        Object.getOwnPropertyNames(init).forEach(key => {
          const asObject = init as HeaderObject;
          const values = asObject[key];
          if (Array.isArray(values)) {
            values.forEach(value => {
              this.append(key, value);
            });
          } else {
            this.append(key, values);
          }
        });
      }
    }
  }

  appendFromString(str: string): void {
    const pairs = str.split("\r\n");
    for (let i = 0; i < pairs.length; i++) {
      const p = pairs[i];
      const index = p.indexOf(": ");
      if (index > 0) {
        const key = p.substring(0, index);
        const value = p.substring(index + 2);
        this.append(key, value);
      }
    }
  }

  // delete either the key (all values) or a specific value for a key
  delete(key: string, value?: string): void {
    const normalizedKey = normalizeName(key);
    if (value === undefined) {
      delete this.keyValueMap[normalizedKey];
    } else {
      const existing = this.keyValueMap[normalizedKey];
      if (existing) {
        const index = existing.indexOf(value);
        if (index >= 0) {
          existing.splice(index, 1);
        }
        if (existing.length === 0) {
          // The last value was removed - remove the key
          delete this.keyValueMap[normalizedKey];
        }
      }
    }
  }

  append(key: string, value: string | string[]): void {
    const normalizedKey = normalizeName(key);
    if (!Array.isArray(this.keyValueMap[normalizedKey])) {
      this.keyValueMap[normalizedKey] = [];
    }
    if (Array.isArray(value)) {
      value.forEach(arrayValue => {
        this.keyValueMap[normalizedKey].push(normalizeValue(arrayValue));
      });
    } else {
      this.keyValueMap[normalizedKey].push(normalizeValue(value));
    }
  }

  // set overrides all existing values for a key
  set(key: string, value: string | string[]): void {
    const normalizedKey = normalizeName(key);
    if (Array.isArray(value)) {
      const normalized: string[] = [];
      value.forEach(arrayValue => {
        normalized.push(normalizeValue(arrayValue));
      });
      this.keyValueMap[normalizedKey] = normalized;
    } else {
      this.keyValueMap[normalizedKey] = [normalizeValue(value)];
    }
  }

  has(key: string, value?: string): boolean {
    const keyArray = this.keyValueMap[normalizeName(key)];
    const keyExists = Array.isArray(keyArray);
    if (!keyExists) {
      return false;
    }
    if (value !== undefined) {
      const normalizedValue = normalizeValue(value);
      return keyArray.indexOf(normalizedValue) >= 0;
    } else {
      return true;
    }
  }

  get(key: string): string[] {
    const values = this.keyValueMap[normalizeName(key)];
    if (values !== undefined) {
      return values.concat();
    }
    return [];
  }

  // forEach iterates through the keys and calls the callback with the key and *all* of it's values as an array
  forEach(callback: (key: string, values: string[]) => void): void {
    Object.getOwnPropertyNames(this.keyValueMap)
      .forEach(key => {
        callback(key, this.keyValueMap[key]);
      }, this);
  }
}
