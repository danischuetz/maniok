# Node Service

![Node Components](embed:bitcoin-core-node-components)

The node service is the main runtime boundary in the repository. In build terms, `src/CMakeLists.txt` assembles the `bitcoin_node` library from the networking, validation, storage, startup, index, RPC, REST, and policy sources, then links that library into `bitcoind` and, when IPC is enabled, into `bitcoin-node`.

## Component Mapping

### P2P Networking

This part is evidenced by files such as `net.cpp`, `net_processing.cpp`, `addrman.cpp`, `banman.cpp`, `headerssync.cpp`, `i2p.cpp`, `mapport.cpp`, and related `node` helpers. It owns peer connections, transport state, peer discovery, address handling, and message relay.

### Validation and Chainstate

This part is evidenced by `validation.cpp`, `txdb.cpp`, `txmempool.cpp`, `versionbits.cpp`, the `index/` sources, and the `node/chainstate.cpp` and `kernel/` sources included in the node target. It is responsible for consensus and policy checks, mempool acceptance, UTXO and block index persistence, and higher-level node state transitions.

### RPC and REST Services

This part is evidenced by `httprpc.cpp`, `httpserver.cpp`, `rest.cpp`, and the `rpc/` directory sources added to `bitcoin_node`. It exposes administrative and data access surfaces for blockchain, mempool, mining, transaction, networking, and optional wallet operations.

## Adjacent Concerns

- Optional wallet features are linked into the node when `bitcoin_wallet` is available.
- Optional ZMQ notifications are added through `src/zmq` when `WITH_ZMQ` is enabled.
- External signing is supported through the signer command interface documented in `doc/external-signer.md`.
- The multiprocess build adds IPC support from `src/ipc`, but the current codebase still shares most node behavior through the same `bitcoin_node` library.
