import client from "./client";
import axios from "axios";

const BLOCKCHAIN_BASE_URL = import.meta.env.VITE_BLOCKCHAIN_BASE_URL;

const blockchainClient = axios.create({
  baseURL: BLOCKCHAIN_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_BLOCKCHAIN_API_KEY}`,
  },
});

export const submitHashToBlockchain = (documentName, documentHash, metadata) =>
  blockchainClient.post("/api/documents/submit", {
    documentName,
    documentHash,
    metadata,
  });

export const getBlockchainVerificationStatus = (verificationId) =>
  blockchainClient.get(`/api/documents/status/${verificationId}`);

export const requestUploadUrl = (contentType, optimizationLevel) => {
  return client.post("/upload-url", { contentType, optimizationLevel });
};

export const uploadFileToS3 = (uploadUrl, file, onProgress) => {
  return axios.put(uploadUrl, file, {
    headers: { "Content-Type": file.type },
    onUploadProgress: (e) => {
      const percent = Math.round((e.loaded * 100) / e.total);
      onProgress(percent);
    },
  });
};

export const startProcessing = (key, optimizationLevel, jobId) => {
  return client.post("/process", { key, optimizationLevel, jobId });
};

export const getJobStatus = (jobId) => client.get(`/status/${jobId}`);

export const getDownloadUrl = (jobId) => client.get(`/download/${jobId}`);
