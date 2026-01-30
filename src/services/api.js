export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("https://YOUR_API_GATEWAY_URL/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  const data = await res.json();
  return data.downloadUrl;
}
