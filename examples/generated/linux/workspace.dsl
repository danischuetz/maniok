workspace {
    !docs docs/overview.md

    model {
        developer = person "Kernel Developer" "Configures, builds, tests, and extends the kernel."
        userspace = softwareSystem "Userspace Programs" "Programs and services that consume Linux kernel system calls and device interfaces."

        linuxKernel = softwareSystem "Linux Kernel Repository" "Linux kernel source tree, its build system, and the runtime artifacts produced from it." {
            !docs docs/system.md

            buildSystem = container "Build and Configuration System" "Uses the top-level Makefile, Kbuild, Kconfig, and scripts to configure and compile the kernel, modules, and shipped tools." "GNU Make, Kconfig, shell scripts" {
                !docs docs/build-system.md

                kconfigDefs = component "Kconfig Definitions" "Collects configuration options and dependencies from the top-level Kconfig and subsystem Kconfig files." "Kconfig"
                kbuildRules = component "Kbuild Rules" "Recursively descends into subsystem directories and assembles the configured build outputs." "GNU Make"
                buildScripts = component "Build Scripts" "Generate headers, check dependencies, and support build orchestration from scripts/." "Shell scripts and Make include files"
            }

            kernelImage = container "Kernel Image" "Bootable kernel assembled from architecture code and core subsystems such as init, kernel, mm, fs, net, block, security, and crypto." "C and Rust" {
                !docs docs/kernel-image.md
            }

            kernelModules = container "Loadable Kernel Modules" "Optional kernel extensions built from drivers and selected subsystems, including external module builds via KBUILD_EXTMOD." "C and Rust kernel modules"

            kernelTools = container "Kernel Tools and Selftests" "Userspace tooling and selftests built from tools/ for performance analysis, debugging, tracing, boot configuration, and validation." "C, Python, shell, GNU Make"
        }

        developer -> linuxKernel "Configures, builds, tests, and extends"
        userspace -> linuxKernel "Uses kernel services via system calls and device interfaces"

        developer -> buildSystem "Runs"
        buildSystem -> kernelImage "Produces"
        buildSystem -> kernelModules "Builds"
        buildSystem -> kernelTools "Builds"
        userspace -> kernelImage "Invokes"
        # kernelImage -> kernelModules "Loads and manages"
        # kernelTools -> kernelImage "Observes, tests, and configures"

        kconfigDefs -> kbuildRules "Supplies configuration symbols"
        buildScripts -> kbuildRules "Supports generation and dependency tracking"
    }

    views {
        systemContext linuxKernel "linux-kernel-context" {
            include *
            autoLayout lr
        }

        container linuxKernel "linux-kernel-containers" {
            include *
            autoLayout lr
        }

        component buildSystem "linux-build-components" {
            include *
            autoLayout lr
        }
    }
}