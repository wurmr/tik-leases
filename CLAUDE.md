# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

tik-leases is a web application for displaying active DHCP leases from a MikroTik router. The application fetches lease data via the MikroTik REST API and presents it in a filterable table interface.

**Target User**: Network administrators who need to monitor DHCP leases across VLANs.

## Tech Stack

- **Framework**: TanStack Start (server-side rendered React)
- **Styling**: Tailwind CSS with dark mode support
- **Components**: Shadcn UI (use sparingly, keep it simple)
- **Deployment**: Kubernetes cluster
- **Authentication**: Handled upstream by reverse proxy (not implemented in app)

## MikroTik Router Integration

The app connects to a MikroTik router's REST API to fetch DHCP lease information:

```sh
curl -k -u admin:password https://192.168.88.1/rest/ip/dhcp-server/lease
```

**Configuration**: Router IP and credentials are supplied via environment variables.

**Response Structure**: Array of lease objects containing:
- `.id`: Unique identifier
- `active-address`: Current IP address
- `active-mac-address`: MAC address
- `active-server`: DHCP server name (corresponds to VLAN)
- `host-name`: Device hostname
- `address`, `client-id`, `mac-address`, `server`, `status`: Additional lease details
- `age`, `expires-after`, `last-seen`: Timing information
- `blocked`, `disabled`, `dynamic`, `radius`: Status flags

## Core Features

1. **Display DHCP leases** in a table showing IP, MAC, hostname, server (VLAN), and status
2. **Filter by VLAN** - user can select a VLAN to show only leases for that server
3. **Server-side rendering** for fast initial page load
4. **Dark mode support** via Tailwind

## Architecture Notes

- The application should make authenticated HTTPS requests to the MikroTik router
- The router uses self-signed certificates (note the `-k` flag in curl), so SSL verification may need to be disabled
- The `active-server` field corresponds to the VLAN and should be used for filtering
- Since authentication is handled upstream, the app doesn't need login functionality

## Development Commands

### Setup

1. **Install dependencies**:
   ```sh
   npm install
   ```

2. **Configure environment variables**:
   Copy `.env.example` to `.env` and update with your MikroTik router credentials:
   ```sh
   cp .env.example .env
   ```

   Then edit `.env`:
   ```
   MIKROTIK_URL=https://192.168.88.1
   MIKROTIK_USERNAME=admin
   MIKROTIK_PASSWORD=your_password
   ```

### Running the Application

- **Development server** (with hot reload):
  ```sh
  npm run dev
  ```
  The app will be available at `http://localhost:3000`

- **Production build**:
  ```sh
  npm run build
  ```

- **Start production server**:
  ```sh
  npm start
  ```

## Project Structure

```
tik-leases/
├── app/
│   ├── routes/
│   │   ├── __root.tsx       # Root layout with HTML structure
│   │   └── index.tsx        # Main page with leases table
│   ├── styles/
│   │   └── globals.css      # Tailwind imports
│   ├── types/
│   │   └── dhcp-lease.ts    # TypeScript types for lease data
│   ├── utils/
│   │   └── mikrotik.ts      # MikroTik API client
│   ├── client.tsx           # Client-side entry point
│   ├── router.tsx           # Router configuration
│   └── ssr.tsx              # Server-side rendering entry point
├── app.config.ts            # TanStack Start configuration
├── .env                     # Environment variables (not in git)
└── .env.example             # Environment variable template
```
- IMPORTANT Do not read the .env file ever.