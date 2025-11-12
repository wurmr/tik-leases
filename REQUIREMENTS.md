# Requirements

This document serves as the general requirements for the application tik-leases.

## General user requirements

The user is a network administrator who is interested in seeing active DHCP leases for a mirkotik router on the network. These leases should be available by visiting a webpage. The page should show a simple table that displays the IP/Mac/hostname/server (which lines up with the vlan)/class/status and whatever else is interesting.

The user wants to be able to select a vlan and show the addresses for that vlan only (filter).

## Technical thoughts

- This should be a web app, server side rendered (tanstack start).
- It will be hosted in a kubernetes cluster.
- connection string to router (ip address) and credentials will be supplied in an environment variable.
- Authentication to use the app will be handled upstream by the reverse proxy.
- Styling should use tailwind and support dark mode.
- use Shadecn if shared components are needed, but keep it simple.

## How to connect and query the router

This curl command will get a json document of the current leases

```sh
curl -k -u admin:password https://192.168.88.1/rest/ip/dhcp-server/lease
```

Here is an example response, an with objects each representing a single host/lease:

```json
[
  {
    ".id": "*5CDB9",
    "active-address": "192.168.40.13",
    "active-client-id": "ff:35:0:bd:8:0:1:0:1:c7:92:bc:d7:c0:f5:35:0:bd:8",
    "active-mac-address": "C0:F5:35:00:BD:08",
    "active-server": "dhcp.iot",
    "address": "192.168.40.13",
    "address-lists": "",
    "age": "3h55m47s",
    "blocked": "false",
    "client-id": "ff:35:0:bd:8:0:1:0:1:c7:92:bc:d7:c0:f5:35:0:bd:8",
    "dhcp-option": "",
    "disabled": "false",
    "dynamic": "true",
    "expires-after": "20h4m13s",
    "host-name": "WiiM Amp-BD08",
    "last-seen": "3h55m47s",
    "mac-address": "C0:F5:35:00:BD:08",
    "radius": "false",
    "server": "dhcp.iot",
    "status": "bound"
  }
]
```
