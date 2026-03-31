// src/api/virusTotal.js
import axios from "axios";
import CryptoJS from "crypto-js";

const VT_API_KEY = import.meta.env.VITE_VT_API_KEY;
const VT_BASE_URL = "https://www.virustotal.com/api/v3";

const vtClient = axios.create({
  baseURL: VT_BASE_URL,
  headers: {
    "x-apikey": VT_API_KEY,
  },
});

export const hashFile = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
      resolve(CryptoJS.SHA256(wordArray).toString());
    };
    reader.readAsArrayBuffer(file);
  });

export const checkFileHash = (hash) => vtClient.get(`/files/${hash}`);

export const uploadFileForScan = (file) => {
  const form = new FormData();
  form.append("file", file);
  return vtClient.post("/files", form);
};

export const getScanAnalysis = (analysisId) =>
  vtClient.get(`/analyses/${analysisId}`);
