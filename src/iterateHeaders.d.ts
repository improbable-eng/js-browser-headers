import { WindowHeaders } from "./WindowHeaders";

/** @internal */
export declare function iterateHeaders(headers: WindowHeaders, callback: (entry: string[]) => void): void;

/** @internal */
export declare function iterateHeadersKeys(headers: WindowHeaders, callback: (key: string) => void): void;