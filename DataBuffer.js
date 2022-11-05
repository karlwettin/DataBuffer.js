
class DataBufferBitSet {

    bytes;
    value = 0;

    constructor(length) {
        if (length % 8 !== 0) throw length + " is not dividable by 8";
        this.bytes = length / 8;
        if (this.bytes !== 1 && this.bytes !==2 && this.bytes !== 4 && this.bytes !== 8)
            throw "Length must be 8, 16, 32 or 64 bits";
    }

    get(bit){
        return ((this.value>>bit) % 2 != 0)
    }

    set(bit){
        this.value = this.value | 1<<bit;
    }

    clear(bit){
        this.value = this.value & ~(1<<bit);
    }

    toggle(bit){
        this.value = bit_test(this.value, bit) ? bit_clear(this.value, bit) : bit_set(this.value, bit);
    }

    /**
     * @param writer DataBufferWriter
     */
    write(writer) {
        if (this.bytes === 1)
            writer.writeInt8(this.value);
        else if (this.bytes === 2)
            writer.writeInt16(this.value);
        else if (this.bytes === 4)
            writer.writeInt32(this.value);
        else if (this.bytes === 8)
            writer.writeInt64(this.value);
        else
            throw "Unexpected byte size";
    }

    /**
     * @param reader DataBufferReader
     */
    read(reader) {
        if (this.bytes === 1)
            this.value = reader.readInt8(this.value);
        else if (this.bytes === 2)
            this.value = reader.readInt16(this.value);
        else if (this.bytes === 4)
            this.value = reader.readInt32(this.value);
        else if (this.bytes === 8)
            this.value = reader.readInt64(this.value);
        else
            throw "Unexpected byte size";

    }

}

class DataBufferReader {

    data;
    offset = 0;

    constructor(buffer) {
        this.data = new DataView(buffer);
        this.offset = 0;
    }

    readInt8() {
        try {
            return this.data.getInt8(this.offset);
        } finally {
            this.offset += 1;
        }
    }
    readUInt8() {
        try {
            return this.data.getUint8(this.offset);
        } finally {
            this.offset += 1;
        }
    }

    readInt16() {
        try {
            return this.data.getInt16(this.offset);
        } finally {
            this.offset += 2;
        }
    }
    readUInt16() {
        try {
            return this.data.getUint16(this.offset);
        } finally {
            this.offset += 2;
        }
    }

    readInt32() {
        try {
            return this.data.getInt32(this.offset);
        } finally {
            this.offset += 4;
        }
    }
    readUInt32() {
        try {
            return this.data.getUint32(this.offset);
        } finally {
            this.offset += 4;
        }
    }

    readInt64() {
        try {
            return this.data.getBigInt64(this.offset);
        } finally {
            this.offset += 8;
        }
    }
    readUInt64() {
        try {
            return this.data.getBigUint64(this.offset);
        } finally {
            this.offset += 8;
        }
    }

    readFloat32() {
        try {
            return this.data.getFloat32(this.offset);
        } finally {
            this.offset += 4;
        }
    }

    readFloat64() {
        try {
            return this.data.getFloat64(this.offset);
        } finally {
            this.offset += 8;
        }
    }
}

class DataBufferWriter {

    capacity;
    buffer = null;
    data = null;
    offset = 0;

    constructor(initialCapacity) {
        this.capacity = initialCapacity;
        this.buffer = new ArrayBuffer(initialCapacity);
        this.data = new DataView(this.buffer);
    }

    growIfRequired(bytesRequired) {
        if (this.offset + bytesRequired >= this.capacity) {
            let newCapacity = this.capacity * 2;
            let newBuffer = new ArrayBuffer(newCapacity);
            new Uint8Array(newBuffer).set(new Uint8Array(this.buffer));
            this.buffer = newBuffer;
            this.data = new DataView(newBuffer);
        }
    }

    trim() {
        if (this.offset === this.capacity) return this.buffer;
        let trimmed = new ArrayBuffer(this.offset);
        let writeTo = new DataView(trimmed);
        let readFrom = new DataView(this.buffer);
        for (let i=0;i<this.offset; i++)
            writeTo.setInt8(i, readFrom.getInt8(i));
        return trimmed;
    }

    writeInt8(value) {
        this.growIfRequired(1);
        this.data.setInt8(this.offset, value);
        this.offset += 1;
    }
    writeUInt8(value) {
        this.growIfRequired(1);
        this.data.setUint8(this.offset, value);
        this.offset += 1;

    }

    writeInt16(value) {
        this.growIfRequired(2);
        this.data.setInt16(this.offset, value);
        this.offset += 2;
    }
    writeUInt16(value) {
        this.growIfRequired(2);
        this.data.setUint16(this.offset, value);
        this.offset += 2;
    }

    writeInt32(value) {
        this.growIfRequired(4);
        this.data.setInt32(this.offset, value);
        this.offset += 4;
    }
    writeUInt32(value) {
        this.growIfRequired(4);
        this.data.setUint32(this.offset, value);
        this.offset += 4;
    }

    writeInt64(value) {
        this.growIfRequired(8);
        this.data.setBigInt64(this.offset, value);
        this.offset += 8;
    }
    writeUInt64(value) {
        this.growIfRequired(8);
        this.data.setBigUint64(this.offset, value);
        this.offset += 8;
    }

    writeFloat32(value) {
        this.growIfRequired(4);
        this.data.setFloat32(this.offset, value);
        this.offset += 4;
    }

    writeFloat64(value) {
        this.growIfRequired(8);
        this.data.setFloat64(this.offset, value);
        this.offset += 8;
    }
}
