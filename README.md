# Maniok

The git-native solution for C4 architecture documentation - like Docusaurus for architects, with C4 diagrams-as-code but without the setup overhead.

https://app.maniok.io

# Manual deployment

Log in to GHCR using docker (providing a personal access token as password)

```bash
docker login ghcr.io
```

Build the image

```bash
docker build -t ghcr.io/danischuetz/maniok-webapp:latest
```

**Building on MacOS for Linux server [Important]**

```bash
docker build --platform linux/amd64 -t ghcr.io/danischuetz/maniok-webapp:latest
```

Upload to GHCR

```bash
docker push ghcr.io/danischuetz/maniok-webapp:latest
```
