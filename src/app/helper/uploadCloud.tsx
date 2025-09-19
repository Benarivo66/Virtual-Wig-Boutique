// export default async function uploadToCloudinary(file: File, resourceType: "image" | "video") {
//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET!);

//   const res = await fetch(
//     `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
//     {
//       method: "POST",
//       body: formData,
//     }
//   );

//   if (!res.ok) {
//     throw new Error("Failed to upload to Cloudinary");
//   }

//   const data = await res.json();
//   console.log("data secure url", data.secure_url);
//   return data.secure_url as string;
// }

export default async function uploadToCloudinary(file: File, resourceType: "image" | "video") {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Missing Cloudinary config (check env vars).");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  // Pick endpoint dynamically based on type
  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const res = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const data = await res.json();
  return data.secure_url as string;
}
