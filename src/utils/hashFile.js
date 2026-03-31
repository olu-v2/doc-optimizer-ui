import CryptoJS from "crypto-js";

export const hashFile = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
      resolve(CryptoJS.SHA256(wordArray).toString());
    };
    reader.readAsArrayBuffer(file);
  });
