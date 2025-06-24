interface HuffmanNode {
  char: string | null;
  frequency: number;
  left: HuffmanNode | null;
  right: HuffmanNode | null;
}

class HuffmanTree {
  private root: HuffmanNode | null = null;
  private codes: Map<string, string> = new Map();

  private buildFrequencyTable(data: Uint8Array): Map<string, number> {
    const frequencyTable = new Map<string, number>();
    
    for (const byte of data) {
      const char = String.fromCharCode(byte);
      frequencyTable.set(char, (frequencyTable.get(char) || 0) + 1);
    }
    
    return frequencyTable;
  }

  private buildHuffmanTree(frequencyTable: Map<string, number>): HuffmanNode | null {
    if (frequencyTable.size === 0) return null;
    if (frequencyTable.size === 1) {
      const [char, frequency] = frequencyTable.entries().next().value;
      return { char, frequency, left: null, right: null };
    }

    const nodes: HuffmanNode[] = Array.from(frequencyTable.entries())
      .map(([char, frequency]) => ({ char, frequency, left: null, right: null }))
      .sort((a, b) => a.frequency - b.frequency);

    while (nodes.length > 1) {
      const left = nodes.shift()!;
      const right = nodes.shift()!;
      
      const merged: HuffmanNode = {
        char: null,
        frequency: left.frequency + right.frequency,
        left,
        right
      };

      let inserted = false;
      for (let i = 0; i < nodes.length; i++) {
        if (merged.frequency <= nodes[i].frequency) {
          nodes.splice(i, 0, merged);
          inserted = true;
          break;
        }
      }
      if (!inserted) {
        nodes.push(merged);
      }
    }

    return nodes[0];
  }

  private generateCodes(node: HuffmanNode | null, code: string = ''): void {
    if (!node) return;

    if (node.char !== null) {
      this.codes.set(node.char, code || '0');
      return;
    }

    this.generateCodes(node.left, code + '0');
    this.generateCodes(node.right, code + '1');
  }

  compress(data: Uint8Array): { compressed: Uint8Array; tree: string } {
    if (data.length === 0) {
      return { compressed: new Uint8Array(0), tree: JSON.stringify({}) };
    }

    const frequencyTable = this.buildFrequencyTable(data);
    this.root = this.buildHuffmanTree(frequencyTable);
    
    if (!this.root) {
      return { compressed: new Uint8Array(0), tree: JSON.stringify({}) };
    }

    this.codes.clear();
    this.generateCodes(this.root);

    let encodedString = '';
    for (const byte of data) {
      const char = String.fromCharCode(byte);
      encodedString += this.codes.get(char) || '';
    }

    const padding = 8 - (encodedString.length % 8);
    if (padding !== 8) {
      encodedString += '0'.repeat(padding);
    }

    const compressedBytes = new Uint8Array(encodedString.length / 8 + 1);
    compressedBytes[0] = padding;

    for (let i = 0; i < encodedString.length; i += 8) {
      const byte = encodedString.substr(i, 8);
      compressedBytes[Math.floor(i / 8) + 1] = parseInt(byte, 2);
    }

    const treeData = Object.fromEntries(this.codes);
    return { compressed: compressedBytes, tree: JSON.stringify(treeData) };
  }

  decompress(compressedData: Uint8Array, treeData: string): Uint8Array {
    if (compressedData.length === 0) {
      return new Uint8Array(0);
    }

    const codes = JSON.parse(treeData);
    const reverseCodeMap = new Map<string, string>();
    
    for (const [char, code] of Object.entries(codes)) {
      reverseCodeMap.set(code as string, char);
    }

    const padding = compressedData[0];
    let binaryString = '';

    for (let i = 1; i < compressedData.length; i++) {
      binaryString += compressedData[i].toString(2).padStart(8, '0');
    }

    if (padding !== 8) {
      binaryString = binaryString.slice(0, -padding);
    }

    const decodedChars: string[] = [];
    let currentCode = '';

    for (const bit of binaryString) {
      currentCode += bit;
      if (reverseCodeMap.has(currentCode)) {
        decodedChars.push(reverseCodeMap.get(currentCode)!);
        currentCode = '';
      }
    }

    const result = new Uint8Array(decodedChars.length);
    for (let i = 0; i < decodedChars.length; i++) {
      result[i] = decodedChars[i].charCodeAt(0);
    }

    return result;
  }
}

export const huffmanCompress = (data: Uint8Array): { compressed: Uint8Array; metadata: string } => {
  const huffman = new HuffmanTree();
  const result = huffman.compress(data);
  
  const metadata = JSON.stringify({
    tree: result.tree,
    originalLength: data.length
  });
  
  const metadataBytes = new TextEncoder().encode(metadata);
  const metadataLength = new Uint8Array(4);
  const view = new DataView(metadataLength.buffer);
  view.setUint32(0, metadataBytes.length, true);
  
  const finalResult = new Uint8Array(4 + metadataBytes.length + result.compressed.length);
  finalResult.set(metadataLength, 0);
  finalResult.set(metadataBytes, 4);
  finalResult.set(result.compressed, 4 + metadataBytes.length);
  
  return { compressed: finalResult, metadata };
};

export const huffmanDecompress = (compressedData: Uint8Array): Uint8Array => {
  if (compressedData.length < 4) {
    throw new Error('Invalid compressed data format');
  }
  
  const view = new DataView(compressedData.buffer, compressedData.byteOffset);
  const metadataLength = view.getUint32(0, true);
  
  if (compressedData.length < 4 + metadataLength) {
    throw new Error('Invalid compressed data format');
  }
  
  const metadataBytes = compressedData.slice(4, 4 + metadataLength);
  const metadata = JSON.parse(new TextDecoder().decode(metadataBytes));
  
  const actualCompressedData = compressedData.slice(4 + metadataLength);
  
  const huffman = new HuffmanTree();
  return huffman.decompress(actualCompressedData, metadata.tree);
};