# DataBuffer.js

Javascript ArrayBuffer helper for writing a binary stream of primitive signed and unsigned values to a byte array.

I wrote this code when unable to find a simple solution to serialize a set of values to a byte array
that I could base64 encode to an URL anchor and deserialize back to the original values.

In my case this ment something like:
```
let data = new DataBufferWriter(80);
data.write...;
let serialized_base64 = btoa(String.fromCharCode.apply(null, data.trim()));
...
let hash = $(location).attr('hash');
let binary_string = atob(hash.substring(1));
let len = binary_string.length;
  let bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++)
    bytes[i] = binary_string.charCodeAt(i);
    let inflated = pako.inflate(bytes);
    reader = new DataBufferReader(inflated.buffer);
  }
reader.read...;

```


Example usage:

```
 /* 
  * 80 bytes is just the initial capacity,
  * as we're writing beyong 80 bytes of data,
  * the underlying ArrayBuffer will grow in size.
  * However, in order to save them CPU ticks, 
  * you really want to set initial capacity to the final size in byte.
  */
  let writer = new DataBufferWriter(80);

  writer.writeInt8(256);
  // will cause an exception. Unsigned 8 bit integers must not exceed 127.
  writer.writeUInt8(128);

  // returns ArrayBuffer with the values written to the DataBufferWriter.
  writer.trim();

  writer.writeFloat32(123.321);
  // returns yet an instance of ArrayBuffer.
  writer.trim();

  data.writeInt16(65535)
  // returns yet an instance of ArrayBuffer.
  let arrayBuffer = data.trim();

```

```
  // read the values written in above example:

  let reader = new DataBufferReader(arrayBuffer);
  reader.readInt8();
  reader.readUint8();
  reader.readFloat32();
  reader.readInt16();

```

```
  // constructor parameter must be divisable by 8
  let bitSet =  new DataBufferBitSet(8);
  bitSet.set(0);
  if (!bitSet.get(0)) throw "First bit should be set to true";
  bitSet.clear(0);
  if (bitSet.get(0)) throw "First bit should be set to false";

  bitSet.write(writer);

  let readBitSet = new DataBufferBitSet(8);
  readBitSet.read(reader);
  ...

```


