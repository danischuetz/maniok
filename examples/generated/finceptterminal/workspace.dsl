workspace {
    !docs docs/overview.md
    !docs docs/system.md
    !docs docs/desktop-application.md

    model {
        user = person "User" "Uses Fincept Terminal for financial analysis, market monitoring, research, and trading."

        market_data_providers = softwareSystem "Market and Research Data Providers" "External APIs and feeds for market data, news, macroeconomic series, alternative data, and government datasets."
        broker_platforms = softwareSystem "Broker and Exchange Platforms" "External broker, exchange, and prediction-market platforms used for order routing and streaming market sessions."
        llm_providers = softwareSystem "LLM Providers" "External model providers used by the AI chat and agent features."
        mcp_servers = softwareSystem "External MCP Servers" "External Model Context Protocol servers that provide additional tools to the terminal."

        fincept_terminal = softwareSystem "Fincept Terminal" "Native desktop financial intelligence terminal built with C++20 and Qt6, with Python-based analytics and local persistence." {
            desktop_app = container "Native Desktop Application" "Primary Qt desktop executable that hosts the UI, service layer, trading engine, DataHub, MCP integration, and Python process orchestration." "C++20, Qt6" {
                application_shell = component "Application Shell" "Bootstraps the process, enforces single-instance behavior per profile, initializes shared services, and opens application windows." "C++20, Qt6"
                screen_workbench = component "Screen Workbench" "MainWindow, ScreenRouter, and the screen modules that render the user-facing terminal experience." "C++20, Qt6 Widgets and Qt6 Charts"
                domain_services = component "Domain Services" "Service layer for markets, news, economics, geopolitics, maritime, agents, and related feature domains." "C++20"
                datahub_component = component "DataHub" "In-process pub/sub layer that distributes cached and streaming updates across screens and services." "C++20, Qt signals and slots"
                trading_engine = component "Trading and Stream Engine" "Unified trading facade, broker adapters, exchange sessions, and streaming managers." "C++20, Qt Network and Qt WebSockets"
                python_bridge = component "Python Bridge" "PythonSetupManager and PythonRunner that locate Python and execute analytics scripts as subprocesses." "C++20, QProcess"
                storage_integration = component "Local Storage Integration" "SQLite databases, migrations, repositories, cache storage, and secure local credential handling." "C++20, Qt Sql"
                ai_mcp_integration = component "AI and MCP Integration" "LLM service plus Model Context Protocol initialization and tool management." "C++20, Qt Network"
            }

            python_runtime = container "Python Analytics Scripts" "Collection of Python 3.11+ scripts used for analytics, data connectors, agent logic, and specialized domain integrations, launched on demand by the desktop application." "Python 3.11+"
            local_store = container "Local SQLite Store" "Local SQLite databases used for settings, cache, migrations, repositories, and persisted application state." "SQLite"
        }

        user -> desktop_app "Uses"

        desktop_app -> python_runtime "Executes analytics and connector scripts via QProcess"
        desktop_app -> local_store "Reads from and writes to"
        desktop_app -> market_data_providers "Fetches market, news, macro, and alternative data from"
        desktop_app -> broker_platforms "Submits orders to and receives streams from"
        desktop_app -> llm_providers "Sends prompts to and receives model responses from"
        desktop_app -> mcp_servers "Connects to tools exposed by"

        python_runtime -> market_data_providers "Calls provider APIs used by Python connectors"

        application_shell -> screen_workbench "Creates and coordinates"
        application_shell -> domain_services "Initializes"
        application_shell -> datahub_component "Registers producers and topic types in"
        application_shell -> trading_engine "Initializes"
        application_shell -> python_bridge "Initializes"
        application_shell -> storage_integration "Runs migrations and opens stores through"
        application_shell -> ai_mcp_integration "Initializes"

        screen_workbench -> domain_services "Invokes"
        screen_workbench -> datahub_component "Subscribes to updates from"
        domain_services -> datahub_component "Publishes to and requests data from"
        domain_services -> python_bridge "Executes scripts through"
        domain_services -> storage_integration "Caches and persists data through"
        domain_services -> market_data_providers "Fetches domain data from"
        trading_engine -> datahub_component "Publishes streaming and account topics to"
        trading_engine -> storage_integration "Reads configuration and persists state through"
        trading_engine -> broker_platforms "Submits orders to and receives streams from"
        python_bridge -> python_runtime "Launches"
        storage_integration -> local_store "Reads from and writes to"
        ai_mcp_integration -> domain_services "Invokes terminal capabilities through"
        ai_mcp_integration -> python_bridge "Invokes Python-backed tools through"
        ai_mcp_integration -> llm_providers "Calls"
        ai_mcp_integration -> mcp_servers "Connects to"
    }

    views {
        systemContext fincept_terminal "fincept-terminal-system-context" {
            include *
            autoLayout lr
        }

        container fincept_terminal "fincept-terminal-containers" {
            include *
            autoLayout lr
        }

        component desktop_app "fincept-terminal-desktop-components" {
            include *
            autoLayout lr
        }
    }
}
