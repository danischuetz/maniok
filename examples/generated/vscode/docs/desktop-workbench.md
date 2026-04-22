# Desktop Workbench

![Workbench Components](embed:code-oss-workbench-components)

The desktop workbench container is the clearest place in this repository where component-level structure is directly visible.

The `Workbench Shell` component corresponds to the desktop workbench bootstrap around `src/vs/workbench/workbench.desktop.main.ts` and the browser-facing workbench code it imports. Its role is to assemble the renderer application that users interact with.

The `Workbench Services` component is visible through the large block of service registrations imported from `src/vs/workbench/services/...` and supporting platform services. These services cover native dialogs, lifecycle, host integration, extension management, search, secrets, tunnels, telemetry, and more.

The `Workbench Contributions` component is visible through the imported contribution modules under `src/vs/workbench/contrib/...`. These contribution modules add feature areas such as files, extensions, remote development, terminal, debug, chat, tasks, and webview.

The `Extension Host Starter Bridge` component is a narrow boundary between renderer code and main-process extension host startup. In `src/vs/workbench/services/extensions/electron-browser/extensionHostStarter.ts`, the workbench registers the remote service used to talk to the main process when starting extension hosts.

This is intentionally the only component view in the model. Other parts of the repository are better represented as containers because the source tree shows clear runtime/process boundaries, while this container explicitly exposes at least three meaningful internal parts in code.