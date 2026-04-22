workspace {
	!docs docs/overview.md

	model {
		developer = person "Developer" "Uses Code - OSS locally and through its command-line and remote capabilities."

		codeOss = softwareSystem "Code - OSS" "Open-source development repository for the Visual Studio Code product." {
			!docs docs/system.md

			desktopMain = container "Desktop Main Process" "Electron main process that bootstraps the application, coordinates single-instance behavior, and provides native desktop services." "TypeScript and Electron"
			desktopWorkbench = container "Desktop Workbench" "Renderer-side workbench that assembles the editor UI, desktop services, and feature contributions." "TypeScript, Web APIs, and Electron renderer" {
				!docs docs/desktop-workbench.md

				workbenchShell = component "Workbench Shell" "Bootstraps the desktop workbench and browser-facing UI." "src/vs/workbench/browser and electron-browser"
				workbenchServices = component "Workbench Services" "Registers desktop services such as dialogs, lifecycle, updates, search, tunnels, telemetry, and extension management." "src/vs/workbench/services"
				workbenchContributions = component "Workbench Contributions" "Loads feature contributions such as files, terminal, debug, remote, chat, tasks, and webview." "src/vs/workbench/contrib"
				extensionHostStarterBridge = component "Extension Host Starter Bridge" "Registers the main-process remote service used to start extension host processes from the workbench." "src/vs/workbench/services/extensions/electron-browser"
			}
			extensionHost = container "Extension Host Process" "Node.js process that loads extensions, patches the runtime for compatibility, and communicates with the workbench over IPC." "TypeScript and Node.js"
			remoteServer = container "Remote Server" "HTTP and WebSocket server that hosts the remote extension host agent, serves remote resources, and can spawn the server CLI." "TypeScript and Node.js"
			builtInExtensions = container "Built-in Extensions" "First-party extensions bundled from the extensions folder and loaded through the extension host." "TypeScript, JSON, and extension manifests"
			codeCli = container "Code CLI" "Standalone Rust CLI that launches desktop binaries and supports version, web, agent-host, update, and tunnel commands." "Rust, Tokio, and Clap"
		}

		developer -> codeCli "Runs commands with"
		developer -> desktopWorkbench "Uses for editing, navigation, debugging, search, and extension-driven workflows"
		codeCli -> desktopMain "Launches desktop binaries and forwards command-line arguments to"
		desktopMain -> desktopWorkbench "Creates windows for and brokers native capabilities to"
		desktopWorkbench -> extensionHost "Starts and communicates with over IPC"
		desktopWorkbench -> remoteServer "Connects to for remote workspace and web/agent scenarios"
		extensionHost -> builtInExtensions "Loads and runs"
		remoteServer -> builtInExtensions "Serves remote extension resources from"

		workbenchShell -> workbenchServices "Uses"
		workbenchShell -> workbenchContributions "Loads"
		workbenchServices -> extensionHostStarterBridge "Uses"
		extensionHostStarterBridge -> extensionHost "Starts"
	}

	views {
		systemContext codeOss "code-oss-system-context" {
			include *
			autoLayout lr
		}

		container codeOss "code-oss-runtime-containers" {
			include *
			autoLayout lr
		}

		component desktopWorkbench "code-oss-workbench-components" {
			include *
			autoLayout lr
		}
	}
}
