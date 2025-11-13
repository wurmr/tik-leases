import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { fetchDHCPLeases, getUniqueVLANs } from "../utils/mikrotik";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      const leases = await fetchDHCPLeases();
      const vlans = getUniqueVLANs(leases);
      return { leases, vlans, error: null };
    } catch (error) {
      console.error("Failed to load DHCP leases:", error);
      return {
        leases: [],
        vlans: [],
        error:
          error instanceof Error ? error.message : "Failed to load DHCP leases",
      };
    }
  },
  component: IndexPage,
});

function IndexPage() {
  const { leases, vlans, error } = Route.useLoaderData();
  const [selectedVLAN, setSelectedVLAN] = useState<string>("all");
  const [filteredHostname, setFilteredHostname] = useState("");

  // Filter leases based on selected VLAN
  const filteredLeasesByVlan =
    selectedVLAN === "all"
      ? leases
      : leases.filter((lease) => lease["active-server"] === selectedVLAN);

  const filteredLeases =
    filteredHostname === ""
      ? filteredLeasesByVlan
      : filteredLeasesByVlan.filter((l) =>
          l["host-name"]
            ?.toLocaleUpperCase()
            .includes(filteredHostname.toUpperCase()),
        );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-2xl">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
            Error Loading DHCP Leases
          </h2>
          <p className="text-red-700 dark:text-red-300">{error}</p>
          <p className="text-sm text-red-600 dark:text-red-400 mt-4">
            Please check your environment variables and ensure the MikroTik
            router is accessible.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex justify-between flex-col">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">TikLeases</h1>
          <p className="text-gray-600 dark:text-gray-400">
            MikroTik DHCP Lease Viewer
          </p>
        </div>

        <div className="flex gap-4 items-center justify-between">
          {/* VLAN Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="vlan-filter" className="font-medium">
              Filter by VLAN:
            </label>
            <select
              id="vlan-filter"
              value={selectedVLAN}
              onChange={(e) => setSelectedVLAN(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All VLANs</option>
              {vlans.map((vlan) => (
                <option key={vlan} value={vlan}>
                  {vlan}
                </option>
              ))}
            </select>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredLeases.length} of {leases.length} leases
          </span>

          <div>
            <input
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="search"
              aria-placeholder="search"
              type="text"
              onChange={(e) => setFilteredHostname(e.target.value)}
              value={filteredHostname}
            />
          </div>
        </div>

        {/* Leases Table */}
        {filteredLeases.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No leases found{selectedVLAN !== "all" ? " for this VLAN" : ""}.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    IP Address
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    MAC Address
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Hostname
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Server (VLAN)
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredLeases.map((lease) => (
                  <tr
                    key={lease[".id"]}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-mono">
                      {lease["active-address"]}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">
                      {lease["active-mac-address"]}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {lease["host-name"] || (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {lease["active-server"]}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          lease.status === "bound"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {lease.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="flex justify-around items-center">
        <a href="https://github.com/wurmr">@wurmr</a>
      </div>
    </div>
  );
}
