module Otterside {
    export module Utils {
        export module Base64 {
            var textEncoder = new TextEncoderLite('utf-8');
            var textDecoder = new TextDecoderLite('utf-8');

            /**
             * Enocdes a string as base64
             * @param  {string} value string to encode
             * @return {string}       base64 string
             */
            export function encode(value: string): string {
                if (!value) {
                    return;
                }

                var uint8Array = textEncoder.encode(value);

                return base64js.fromByteArray(uint8Array);
            }

            /**
             * Decodes a base64 string to a utf8 string
             * @param  {string} basee64EncodedString the base64 string
             * @return {string}                      The decoded string
             */
            export function decode(basee64EncodedString: string): string {
                if (!basee64EncodedString) {
                    return;
                }

                var decodedUint8Array = base64js.toByteArray(basee64EncodedString);

                return textDecoder.decode(decodedUint8Array);
            }
        }
    }
}
