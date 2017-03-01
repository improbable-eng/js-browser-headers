// This function is written in JS to avoid an issue with TypeScript targeting ES5 with iterators
export function iterateHeaders(headers, callback) {
  for (let entry of headers) {
    callback(entry);
  }
}

export function iterateHeadersKeys(headers, callback) {
  for (let key of headers.keys()) {
    callback(key);
  }
}