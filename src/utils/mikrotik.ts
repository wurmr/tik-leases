import https from "https";
import type { DHCPLease } from "../types/dhcp-lease";

/**
 * Configuration for connecting to the MikroTik router
 */
interface MikroTikConfig {
  url: string;
  username: string;
  password: string;
}

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

/**
 * Cached configuration - persists through HMR reloads
 * Uses lazy initialization to avoid breaking HMR on errors
 */
let cachedConfig: MikroTikConfig | null = null;

/**
 * Get MikroTik configuration from environment variables
 * Cached after first access to persist through HMR reloads
 */
function getConfig(): MikroTikConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const url = process.env.MIKROTIK_URL;
  const username = process.env.MIKROTIK_USERNAME;
  const password = process.env.MIKROTIK_PASSWORD;

  if (!url || !username || !password) {
    throw new Error(
      "Missing MikroTik configuration. Please set MIKROTIK_URL, MIKROTIK_USERNAME, and MIKROTIK_PASSWORD environment variables.",
    );
  }

  cachedConfig = { url, username, password };
  return cachedConfig;
}

/**
 * Fetch DHCP leases from the MikroTik router
 */
export async function fetchDHCPLeases(): Promise<DHCPLease[]> {
  const config = getConfig();
  const endpoint = `${config.url}/rest/ip/dhcp-server/lease`;

  // Create Basic Auth header
  const auth = Buffer.from(
    `${config.username}:${config.password}`,
  ).toString("base64");

  try {
    // Create custom HTTPS agent that accepts self-signed certificates
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      // @ts-ignore - agent is valid for Node.js fetch
      agent,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch DHCP leases: ${response.status} ${response.statusText}`,
      );
    }

    const leases: DHCPLease[] = await response.json();
    return leases;
  } catch (error) {
    console.error("Error fetching DHCP leases:", error);
    throw new Error(
      error instanceof Error
        ? `Failed to connect to MikroTik router: ${error.message}`
        : "Failed to connect to MikroTik router",
    );
  }
}

/**
 * Extract unique VLAN/server names from leases
 */
export function getUniqueVLANs(leases: DHCPLease[]): string[] {
  const vlans = new Set<string>();
  leases.forEach((lease) => {
    if (lease["active-server"]) {
      vlans.add(lease["active-server"]);
    }
  });
  return Array.from(vlans).sort();
}
