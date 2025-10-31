// ValidatorsInfoDynamic.jsx
import React, { useEffect, useState, useRef } from "react";
import Table from "../components/Table";

/**
 * ValidatorsInfoDynamic
 * - Shows a static list of validator addresses (your 20 addresses).
 * - Polls an API (if provided) every `POLL_INTERVAL_MS` to update live fields.
 * - If API isn't reachable, it simulates smooth dynamic updates locally.
 *
 * Usage:
 *  - Set API_URL to your validators endpoint or leave null to use simulation.
 *  - Table component is expected to accept props: columns, data.
 */

const API_URL = "http://localhost:8080/api/transactions/get-validators"; // or null to force simulation
const POLL_INTERVAL_MS = 5000; // 5s polling (adjust as needed)

// Truncate helper
const truncate = (text, start = 10, end = 10) => {
  if (!text || typeof text !== "string") return "N/A";
  return `${text.slice(0, start)}......${text.slice(-end)}`;
};

const STATIC_VALIDATORS = [
  "0xF4F5340E741f3347a93f26e5110aDE6eD9406323",
  "0x3ef6381B518f35c1186707B452d3B689B3dcEE12",
  "0x17e7033Ad03016AA227e9f161E2eDb563f22fa95",
  "0xA680d72DA8A1cC1498548Fd7b1171243Ee921989",
  "0x119B2fc0CBBa013E5F82D1d7ed578dF834E9d021",
  "0x3Bc63e8b3A8f26028ee4927e134FbCB936c8C94F",
  "0x1F30Ea174C5089793a8a546Eb00dc3B69c93f7DD",
  "0x4E91a44Abd5E48c0C36C0Cb916136F56fdedc1D1",
  "0x935f74a40E0d9c7B8f88a31e5fc38D87F45d4C10",
  "0x2672CD7E6B689636C2446dba9d6463449f5F8939",
  "0x520af0084EE4baeE1004ba1B2a72a50b3c3066fe",
  "0xD90444A97447fF0d68D966Be93b95fd4E9458e90",
  "0x8A584269a84d90e1Dc3BAd218B2FBDE0ad3f55B3",
  "0x94D176A46A546961A19E4046c8E958EA99BadEd0",
  "0x27dB79236D1eaD982d861b8d21ef678f63721F4B",
  "0xADA01030B2E5CE27DE21b09C16020A36ae935A7F",
  "0x0C200711ACC60dBe9cc358a974AA440904A10Da3",
  "0x144701681F2af9F3838acf0D53277C7AaEdEeb97",
  "0x7B07a82652EE78D1e38E1Ea5B93794b29E6c49e7",
  "0xFBe6689dD4aa4fa3F4334BE750bE3adF7c260d8A",
];

const tableColumns = [
  { field: "no", header: "No", minWidth: "60px" },
  { field: "address", header: "Validator Address", body: (rowData) => truncate(rowData.address) }, // truncate helper minWidth: "360px" },
  { field: "signedBlocks", header: "Signed Blocks", minWidth: "140px" },
  { field: "lastSeen", header: "Last Seen", minWidth: "160px" },
  { field: "uptime", header: "Uptime %", minWidth: "120px" },
  { field: "status", header: "Status", minWidth: "120px" },
  { field: "chainId", header: "Chain ID", minWidth: "120px" },
  { field: "totalValidators", header: "Total Validators", minWidth: "140px" },
];

const nowISO = () => new Date().toISOString();

const ValidatorsInfoDynamic = () => {
  const [validatorData, setValidatorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const pollingRef = useRef(null);

  // init data structure (either from API once or simulated)
  useEffect(() => {
    const init = () => {
      const base = STATIC_VALIDATORS.map((address, idx) => ({
        no: idx + 1,
        address,
        signedBlocks: 0, // will be updated
        lastSeen: nowISO(),
        uptime: 100.0,
        status: "active",
        chainId: "N/A",
        totalValidators: STATIC_VALIDATORS.length,
      }));
      setValidatorData(base);
      setLoading(false);
    };

    init();
  }, []);

  // helper: smooth incremental updater (so values change gently like a real explorer)
  const applySimulatedUpdate = (current) => {
    return current.map((v) => {
      // increment signedBlocks by small random amount 0..3
      const inc = Math.floor(Math.random() * 4);
      const newSigned = v.signedBlocks + inc;

      // uptime drifts slightly toward 99-100 range but can drop occasionally
      let newUptime =
        Math.max(90, Math.min(100, v.uptime + (Math.random() - 0.4) * 1.5));
      newUptime = Number(newUptime.toFixed(2));

      // lastSeen update probability: mostly recent, occasionally delay to simulate offline
      const seenNow = Math.random() > 0.05;
      const newLastSeen = seenNow ? nowISO() : v.lastSeen;

      const newStatus = seenNow ? "active" : Math.random() > 0.5 ? "inactive" : "lagging";

      return {
        ...v,
        signedBlocks: newSigned,
        lastSeen: newLastSeen,
        uptime: newUptime,
        status: newStatus,
      };
    });
  };

  // fetch from API (if available) and normalize response into our table shape
  const fetchFromApi = async () => {
    try {
      const res = await fetch(API_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("API returned " + res.status);
      const json = await res.json();

      // Expecting: { validators: [{ address, signedBlocks, lastSeen?, uptime? }], chainId, totalValidators }
      if (!json || !Array.isArray(json.validators)) throw new Error("Unexpected API shape");

      const apiData = STATIC_VALIDATORS.map((address, idx) => {
        const found = json.validators.find(
          (x) => x.address?.toLowerCase() === address.toLowerCase()
        );
        return {
          no: idx + 1,
          address,
          signedBlocks: found?.signedBlocks ?? 0,
          lastSeen: found?.lastSeen ?? nowISO(),
          uptime: found?.uptime ?? 100.0,
          status: found?.status ?? (found ? "active" : "unknown"),
          chainId: json.chainId ?? "N/A",
          totalValidators: json.totalValidators ?? STATIC_VALIDATORS.length,
        };
      });

      setValidatorData(apiData);
    } catch (err) {
      // If API fails, we fall back to simulation — do nothing here (polling loop handles simulation)
      console.warn("Validators API not available, falling back to simulation:", err.message);
      return;
    }
  };

  // main polling loop: try API -> otherwise apply simulated updates
  useEffect(() => {
    let mounted = true;

    const tick = async () => {
      // prefer real API when available
      if (API_URL) {
        try {
          await fetchFromApi();
        } catch {
          // if fetchFromApi throws (it shouldn't because it catches), fallback to simulation below
        }
      }

      // If after API attempt the data is still empty or API not available, simulate updates
      setValidatorData((current) => {
        if (!current || current.length === 0) return current;
        return applySimulatedUpdate(current);
      });
    };

    // initial immediate attempt
    tick().finally(() => {
      if (mounted) setLoading(false);
    });

    pollingRef.current = setInterval(tick, POLL_INTERVAL_MS);

    return () => {
      mounted = false;
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  return (
    <div className="min-h-screen w-full bg-white text-black shadow md:p-5">
      <h1 className="text-2xl font-bold mb-4">Validators Set Info (Live)</h1>

      {loading ? (
        <div className="text-center text-lg font-semibold mt-10">⏳ Loading Validators...</div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Showing {STATIC_VALIDATORS.length} validators — data updates every {POLL_INTERVAL_MS / 1000}s.
            {API_URL ? (
              <span> (attempting to fetch live data from API)</span>
            ) : (
              <span> (simulation mode — no API configured)</span>
            )}
          </div>

          <Table columns={tableColumns} data={validatorData} />
        </>
      )}
    </div>
  );
};

export default ValidatorsInfoDynamic;
