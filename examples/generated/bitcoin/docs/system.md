# Bitcoin Core System

The repository models cleanly as one software system with multiple operator-facing executables built from a common CMake workspace. The build is centered on the top-level `CMakeLists.txt` and `src/CMakeLists.txt`, where options such as `BUILD_DAEMON`, `BUILD_CLI`, `BUILD_GUI`, `ENABLE_WALLET`, `ENABLE_IPC`, `WITH_ZMQ`, and `BUILD_TESTS` decide which binaries and supporting libraries are present.

## Primary Executable Boundaries

- `bitcoind` is the main headless node executable and links the `bitcoin_node` library plus the optional wallet library.
- `bitcoin-node` is the IPC-enabled node executable built when multiprocess support is enabled.
- `bitcoin-cli` is a separate RPC client executable.
- `bitcoin-qt` is the Qt desktop application, and `bitcoin-gui` is the IPC-enabled variant built when IPC is enabled.
- `bitcoin-wallet` and `bitcoin-tx` are offline operator tools for wallet-file maintenance and raw transaction manipulation.
- `bitcoin` is a wrapper executable that dispatches to the other binaries and can choose monolithic or multiprocess variants.

## Architectural Shape

Most runtime behavior is implemented in reusable libraries rather than directly in the executable entry points. This keeps the executable main files small and shifts the architectural weight into shared code such as `bitcoin_node`, `bitcoin_common`, `bitcoin_wallet`, and the optional IPC support.

That split is the key service boundary in this repository: operator-facing binaries are thin entry points, while the node, wallet, and IPC concerns live in reusable modules under `src`.

## Notes On Optionality

Not every container is built in every configuration. GUI, wallet, IPC, ZMQ, benchmarking, fuzzing, and kernel-oriented utilities are all controlled through CMake options. The model therefore documents the supported runtime shape of the repository, not a single mandatory build preset.
