# Bitcoin Core Overview

![Containers](embed:bitcoin-core-containers)

This repository is the Bitcoin Core source tree. According to the root README, it builds software that connects to the Bitcoin peer-to-peer network, downloads and fully validates blocks and transactions, and optionally includes wallet and graphical user interface support.

## Purpose

Bitcoin Core is the reference full node implementation for the Bitcoin network in this repository. It is responsible for consensus validation, peer-to-peer networking, local chainstate and mempool management, RPC and REST access, optional wallet support, and operator-facing desktop and command-line tools.

## Main Runtime and Build-Time Parts

The top-level CMake build defines real executable entry points for the headless node (`bitcoind`), command-line RPC client (`bitcoin-cli`), raw transaction editor (`bitcoin-tx`), desktop GUI (`bitcoin-qt`), wrapper executable (`bitcoin`), and optional wallet and multiprocess binaries (`bitcoin-wallet`, `bitcoin-node`, `bitcoin-gui`).

Under those executables, the build composes several shared libraries and subprojects:

- `bitcoin_common` for shared configuration, chain parameter, script, signing, and RPC support code.
- `bitcoin_node` for node runtime behavior such as P2P networking, validation, RPC server, REST, indexes, and startup.
- `bitcoin_wallet` for optional wallet storage, RPC methods, SQLite-backed persistence, and spending logic.
- `bitcoin_ipc` plus `src/ipc` when multiprocess support is enabled.
- Vendored or subtree-managed dependencies including `secp256k1`, `leveldb`, `minisketch`, `univalue`, and `crc32c`.

## Important Integrations

- The node exchanges blocks, transactions, addresses, and peer messages with the wider Bitcoin network.
- Operators and automation call the node through JSON-RPC, primarily using `bitcoin-cli`.
- When configured with `-signer=<cmd>`, the node can delegate signing-related operations to an external signer or hardware-wallet integration.
- Optional multiprocess builds add IPC-capable binaries (`bitcoin-node`, `bitcoin-gui`) backed by the `src/ipc` code and the multiprocess documentation in `doc/multiprocess.md`.

## Testing and Verification Surfaces

The repository separates unit tests in `src/test` from higher-level integration surfaces in `test`. The root README points to `ctest` for unit tests, while `test/functional/test_runner.py` drives functional and regression scenarios against the built binaries.

## Where To Go Deeper

- `README.md` for project scope and operator-facing summary.
- `src/CMakeLists.txt` for executable and library boundaries.
- `doc/multiprocess.md` and `doc/design/multiprocess.md` for IPC and multiprocess design notes.
- `doc/JSON-RPC-interface.md` for RPC behavior.
- `src/test/README.md` and `test/README.md` for test layers.
