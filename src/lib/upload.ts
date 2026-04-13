import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";
import { v4 as uuidv4 } from "uuid";

/**
 * Uploads a file to Firebase Storage and returns the public download URL.
 * @param file The file object (from FormData)
 * @param folder The folder path in the bucket (e.g., 'ppdb/kk')
 * @returns Promise<string> The download URL
 */
export async function uploadToFirebase(file: File, folder: string): Promise<string> {
  if (!file || file.size === 0) {
    throw new Error("Invalid file: File is empty or missing");
  }

  console.log(`Firebase Upload: Starting for ${file.name} (${file.size} bytes, type: ${file.type})`);

  // Get file extension
  const extension = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${extension}`;
  const fullPath = `${folder}/${fileName}`;

  try {
    // Create storage reference
    const storageRef = ref(storage, fullPath);

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Upload
    const result = await uploadBytes(storageRef, bytes, {
      contentType: file.type || 'application/octet-stream',
    });

    console.log(`Firebase Upload: Success ref: ${result.metadata.fullPath}`);

    // Get and return the download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error: any) {
    console.error(`Firebase Upload: FAILED for ${file.name}`, error);
    throw error;
  }
}

/**
 * Deletes a file from Firebase Storage given its download URL.
 * @param url The public download URL of the file
 */
export async function deleteFromFirebase(url: string | null | undefined): Promise<void> {
  if (!url || !url.includes("firebasestorage.googleapis.com")) {
    console.log("Firebase Delete: Skipping invalid or empty URL");
    return;
  }

  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
    console.log(`Firebase Delete: Success for ${url}`);
  } catch (error: any) {
    // If file is already gone, don't throw error
    if (error.code === 'storage/object-not-found') {
      console.warn(`Firebase Delete: File not found (already deleted?): ${url}`);
      return;
    }
    console.error(`Firebase Delete: FAILED for ${url}`, error);
    // We don't throw here to ensure the DB record deletion isn't blocked by missing images
  }
}
