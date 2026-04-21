# Maniok C4 Documentation Prompt

To quickly get started with Maniok, C4 and the Structurizr DSL, I've prepared a prompt at `maniok-architecture-prompt.md`!

It analyzes your repository and describes it using C4 and the Structurizr DSL. The resulting documentation can be inspected locally through the public maniok-preview docker image (_requires docker to be installed_):

```bash
docker pull ghcr.io/danischuetz/maniok/maniok-preview:latest
docker tag ghcr.io/danischuetz/maniok/maniok-preview maniok-preview
docker run -t --rm -p 8080:8080 -v PATH:/usr/workspace maniok-preview:latest
```

- Replace `PATH` with the absolute path to the generated .maniok directory
- View the documentation at localhost:8080

# Generated examples

The `generated` directory showcases AI-generated example documentation using the `maniok-architecture-prompt.md` for some popular open source projects.

Documentation has been generated for:

- https://github.com/paperless-ngx/paperless-ngx
- https://github.com/Fincept-Corporation/FinceptTerminal
- https://github.com/jamiepine/voicebox
- https://github.com/gtsteffaniak/filebrowser

Just add any of those directories as `PATH` to the maniok-preview command from above to view the generated examples.

## Disclaimer

These docs are AI-generated and might get things absolutely wrong.

They’re meant to showcase C4 architecture documentation using Maniok and are by no means complete or accurate and have not been reviewed by the maintainers of those repositories.
