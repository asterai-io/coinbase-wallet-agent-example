// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.4.1
//   protoc        v3.14.0

import { Writer, Reader, Protobuf } from "@asterai/as-proto/assembly";

export class Empty {
  static encode(message: Empty, writer: Writer): void {}

  static decode(reader: Reader, length: i32): Empty {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new Empty();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  constructor() {}
}