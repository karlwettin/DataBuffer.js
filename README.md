# DataBuffer.js

Javascript ArrayBuffer helper for writing a binary stream of primitive signed and unsigned values to a byte array.

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


