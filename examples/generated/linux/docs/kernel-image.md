# Kernel Image

![Repository Container View](embed:linux-kernel-containers)

The kernel image is the bootable runtime artifact assembled by the build system.

Repository evidence for this container includes the startup path in `init/main.c`, architecture-specific code under `arch/`, and the top-level build descent into major core subsystems such as `kernel/`, `mm/`, `fs/`, `security/`, `crypto/`, `block/`, and `net/`.

Its core responsibility is to initialize the system and provide kernel services for process management, memory management, filesystems, networking, device management, security enforcement, and module loading.

Loadable kernel modules extend this container at runtime, while userspace programs interact with it through system calls and device interfaces.
