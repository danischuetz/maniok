# Linux Kernel Repository System

![System Context](embed:linux-kernel-context)

The repository centers on one software system: the Linux kernel source tree together with the build logic and artifacts it produces.

At the system boundary, two external actors are directly evidenced by the repository:

- Kernel developers configure, build, test, and extend the kernel.
- Userspace programs consume kernel services through system calls and kernel-managed interfaces.

Internally, the repository separates concerns between build orchestration, the bootable kernel image, loadable modules, and shipped userspace tools. This separation is visible in the top-level build files and the major source directories referenced by `Kconfig`, `Kbuild`, and the top-level `Makefile`.

Use the container view for the main build/runtime units and the build system component view for the most explicit internal structure.
