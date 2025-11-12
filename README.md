# TikLeases

A web application for monitoring DHCP leases from MikroTik routers. Displays active leases in a filterable table interface with support for multiple VLANs.

## Quick Start with Docker

Run the application using Docker:

```bash
docker run -d \
  --name tik-leases \
  -p 3000:3000 \
  -e MIKROTIK_URL=https://192.168.88.1 \
  -e MIKROTIK_USERNAME=username \
  -e MIKROTIK_PASSWORD=your_password \
  ghcr.io/wurmr/tik-leases:latest
```

Access the application at `http://localhost:3000`

## Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: "3.8"

services:
  tik-leases:
    image: ghcr.io/wurmr/tik-leases:latest
    container_name: tik-leases
    ports:
      - "3000:3000"
    environment:
      - MIKROTIK_URL=https://192.168.88.1
      - MIKROTIK_USERNAME=username
      - MIKROTIK_PASSWORD=your_password
    restart: unless-stopped
```

Run with:

```bash
docker-compose up -d
```

## Environment Variables

| Variable            | Description                  | Example                |
| ------------------- | ---------------------------- | ---------------------- |
| `MIKROTIK_URL`      | MikroTik router REST API URL | `https://192.168.88.1` |
| `MIKROTIK_USERNAME` | Router admin username        | `username`             |
| `MIKROTIK_PASSWORD` | Router admin password        | `your_password`        |

## Features

- Display active DHCP leases (IP, MAC, hostname, VLAN)
- Filter leases by VLAN/server
- Dark mode support
- Server-side rendered for fast page loads
- Multi-architecture support (x86_64, ARM64/Raspberry Pi)

## Development

For local development instructions, see [CLAUDE.md](./CLAUDE.md).
