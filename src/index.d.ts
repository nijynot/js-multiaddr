/// <reference types="node" />

declare interface NetOptions {
  family: 'ipv4' | 'ipv6';
  host: string;
  transport: string;
  port: number;
}

declare interface Protocol {
  code: number;
  size: number;
  name: string;
  resolvable: boolean;
  path: boolean;
}

declare interface Protocols {
  table: [number, number, string, boolean?, boolean?][];
  names: Record<string, Protocol>;
  codes: Record<number, Protocol>;
  object(code: number, size: number, name: string, resolvable?: any, path?: any): Protocol;
}

declare interface NodeAddress {
  family: 4 | 6;
  address: string;
  port: number;
}

declare type MultiaddrInput = string | Buffer | Multiaddr;

declare class Multiaddr {
  /**
   * Creates a [multiaddr](https://github.com/multiformats/multiaddr) from
   * a Buffer, String or another Multiaddr instance
   * public key.
   * @param addr - If String or Buffer, needs to adhere
   * to the address format of a [multiaddr](https://github.com/multiformats/multiaddr#string-format)
   */
  constructor(addr?: MultiaddrInput);

  /**
   * Returns Multiaddr as a String
   */
  toString(): string;

  /**
   * Returns Multiaddr as a JSON encoded object
   */
  toJSON(): string;

  /**
   * Returns Multiaddr as a convinient options object to be used with net.createConnection
   */
  toOptions(): NetOptions;

  /**
   * Returns Multiaddr as a human-readable string
   */
  inspect(): string;

  /**
   * Returns the protocols the Multiaddr is defined with, as an array of objects, in
   * left-to-right order. Each object contains the protocol code, protocol name,
   * and the size of its address space in bits.
   * [See list of protocols](https://github.com/multiformats/multiaddr/blob/master/protocols.csv)
   */
  protos(): Protocol[];

  /**
   * Returns the codes of the protocols in left-to-right order.
   * [See list of protocols](https://github.com/multiformats/multiaddr/blob/master/protocols.csv)
   */
  protoCodes(): number[];

  /**
   * Returns the names of the protocols in left-to-right order.
   * [See list of protocols](https://github.com/multiformats/multiaddr/blob/master/protocols.csv)
   */
  protoNames(): string[];

  /**
   * Returns a tuple of parts
   */
  tuples(): [number, Buffer][];

  /**
   * Returns a tuple of string/number parts
   */
  stringTuples(): [number, string | number][];

  /**
   * Encapsulates a Multiaddr in another Multiaddr
   */
  encapsulate(addr: MultiaddrInput): Multiaddr;

  /**
   * Decapsulates a Multiaddr from another Multiaddr
   */
  decapsulate(addr: MultiaddrInput): Multiaddr;

  /**
   * A more reliable version of `decapsulate` if you are targeting a
   * specific code, such as 421 (the `p2p` protocol code). The last index of the code
   * will be removed from the `Multiaddr`, and a new instance will be returned.
   * If the code is not present, the original `Multiaddr` is returned.
   */
  decapsulateCode(code: number): Multiaddr;

  /**
   * Extract the peerId if the multiaddr contains one
   */
  getPeerId(): string;

  /**
   * Extract the path if the multiaddr contains one
   */
  getPath(): string | null;

  /**
   * Checks if two Multiaddrs are the same
   */
  equals(addr: Multiaddr): boolean;

  /**
   * Gets a Multiaddrs node-friendly address object. Note that protocol information
   * is left out: in Node (and most network systems) the protocol is unknowable
   * given only the address.
   *
   * Has to be a ThinWaist Address, otherwise throws error
   */
  nodeAddress(): NodeAddress;

  /**
   * Returns if a Multiaddr is a Thin Waist address or not.
   *
   * Thin Waist is if a Multiaddr adheres to the standard combination of:
   *
   * `{IPv4, IPv6}/{TCP, UDP}`
   */
  isThinWaistAddress(addr?: Multiaddr): boolean;
}

declare interface MultiaddrClass {
  /**
   * Creates a [multiaddr](https://github.com/multiformats/multiaddr) from
   * a Buffer, String or another Multiaddr instance
   * public key.
   * @param addr - If String or Buffer, needs to adhere
   * to the address format of a [multiaddr](https://github.com/multiformats/multiaddr#string-format)
   */
  (addr?: MultiaddrInput): Multiaddr;

  /**
   * Creates a Multiaddr from a node-friendly address object
   */
  fromNodeAddress(addr: NodeAddress, transport: string): Multiaddr;

  /**
   * Object containing table, names and codes of all supported protocols.
   * To get the protocol values from a Multiaddr, you can use
   * [`.protos()`](#multiaddrprotos),
   * [`.protoCodes()`](#multiaddrprotocodes) or
   * [`.protoNames()`](#multiaddrprotonames)
   */
  protocols: Protocols;

  /**
   * Returns if something is a Multiaddr
   */
  isMultiaddr(addr: unknown): addr is Multiaddr;

  /**
   * Returns if something is a Multiaddr that is a name
   */
  isName(addr: Multiaddr): boolean;

  /**
   * Returns an array of multiaddrs, by resolving the multiaddr that is a name
   */
  resolve(addr: Multiaddr): Promise<Multiaddr[]>
}

export = MultiaddrClass;
