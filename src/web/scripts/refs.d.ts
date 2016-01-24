/// <reference path="../../../bower_components/phaser/typescript/phaser.d.ts"/>
/// <reference path="../../../typings/tsd.d.ts"/>

interface Base64JS {
    fromByteArray: (uint8Array: Uint8Array) => string;
    toByteArray: (base64String: string) => Uint8Array;
}

declare var base64js: Base64JS;

declare class TextEncoderLite {
    constructor(encoding: string);
    encode: (value: string) => Uint8Array;
}

declare class TextDecoderLite {
    constructor(encoding: string);
    decode: (uint8Array: Uint8Array) => string;
}
