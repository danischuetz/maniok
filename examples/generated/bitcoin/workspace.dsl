workspace {
    !docs docs/overview.md
    !impliedRelationships false

    model {
        operator = person "Node Operator"

        bitcoin_network = softwareSystem "Bitcoin Network" "Peer-to-peer network of other Bitcoin nodes."
        external_signer = softwareSystem "External Signer" "Optional signer command or hardware-wallet integration used for external signing flows."

        bitcoin_core = softwareSystem "Bitcoin Core" "Reference Bitcoin full node, wallet, GUI, and operator tooling built from this repository." {
            !docs docs/system.md

            wrapper = container "bitcoin Wrapper" "Routes high-level commands to the appropriate executable, and selects monolithic or multiprocess binaries when requested." "C++20 executable"

            node_service = container "Node Service (bitcoind / bitcoin-node)" "Validates blocks and transactions, maintains chainstate and mempool, participates in the Bitcoin P2P network, and serves RPC, REST, and optional ZMQ interfaces." "C++20 executable" {
                !docs docs/node-service.md

                p2p = component "P2P Networking" "Manages peer connections, address management, transport, and message relay." "C++"
                validation = component "Validation and Chainstate" "Performs consensus and policy checks and maintains chainstate, mempool, and indexes." "C++"
                rpc_services = component "RPC and REST Services" "Exposes HTTP RPC and REST endpoints for administration, blockchain queries, mining, wallet operations, and transaction submission." "C++"
            }

            cli = container "RPC Client (bitcoin-cli)" "Command-line client for JSON-RPC requests to a running node, with IPC-aware startup options." "C++20 executable"
            gui = container "Desktop GUI (bitcoin-qt / bitcoin-gui)" "Qt desktop application for wallet and node operations. The IPC-enabled build adds bitcoin-gui alongside bitcoin-qt." "Qt 6 and C++20 executable"
            wallet_tool = container "Wallet Tool (bitcoin-wallet)" "Offline utility for creating, inspecting, dumping, and restoring wallet files." "C++20 executable"
            tx_tool = container "Transaction Tool (bitcoin-tx)" "Offline utility for creating and modifying raw transactions." "C++20 executable"
        }

        operator -> wrapper "Runs top-level commands"
        operator -> cli "Uses for direct RPC calls"
        operator -> gui "Uses for desktop wallet and node monitoring"
        operator -> wallet_tool "Uses for offline wallet maintenance"
        wrapper -> tx_tool "Uses for offline transaction construction"

        wrapper -> node_service "Launches node commands"
        wrapper -> gui "Launches gui commands"
        wrapper -> cli "Launches rpc commands"
        wrapper -> wallet_tool "Launches wallet commands"
        wrapper -> tx_tool "Launches tx commands"

        cli -> node_service "Calls JSON-RPC"
        node_service -> bitcoin_network "Exchanges blocks, transactions, addresses, and peer messages"
        node_service -> external_signer "Invokes signer command for external signing flows"

        p2p -> bitcoin_network "Exchanges blocks, transactions, addresses, and peer messages"
        p2p -> validation "Submits peer data for validation and relay decisions"
        validation -> p2p "Announces accepted blocks and transactions"
        rpc_services -> validation "Queries node state and submits actions"
        cli -> rpc_services "Sends RPC requests"
        rpc_services -> external_signer "Invokes the configured signer command when needed"
    }

    views {
        container bitcoin_core "bitcoin-core-containers" {
            include *
            autoLayout lr
        }

        component node_service "bitcoin-core-node-components" {
            include *
            autoLayout lr
        }
    }
}