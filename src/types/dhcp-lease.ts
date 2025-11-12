/**
 * Represents a DHCP lease from the MikroTik router REST API
 */
export interface DHCPLease {
  '.id': string;
  'active-address': string;
  'active-client-id'?: string;
  'active-mac-address': string;
  'active-server': string;
  'address': string;
  'address-lists'?: string;
  'age'?: string;
  'blocked': string;
  'client-id'?: string;
  'dhcp-option'?: string;
  'disabled': string;
  'dynamic': string;
  'expires-after'?: string;
  'host-name'?: string;
  'last-seen'?: string;
  'mac-address': string;
  'radius': string;
  'server': string;
  'status': string;
}

/**
 * Type for filtering leases by VLAN/server
 */
export type VLANFilter = string | 'all';
