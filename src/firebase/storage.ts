
'use client';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeFirebase } from '.';

/**
 * Uploads a user's profile picture to Firebase Storage.
 * @param uid The user's unique ID.
 * @param file The image file to upload.
 * @returns A promise that resolves with the public URL of the uploaded image.
 */
export async function uploadProfilePicture(uid: string, file: File): Promise<string> {
  const { storage } = initializeFirebase();
  // Create a storage reference with a unique path for the user's profile picture.
  // Using a consistent file name like 'profile.jpg' makes it easy to overwrite.
  const storageRef = ref(storage, `profile-pictures/${uid}/profile.${file.name.split('.').pop()}`);

  // Upload the file to the specified path.
  const snapshot = await uploadBytes(storageRef, file);

  // Get the public URL of the uploaded file.
  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
}


/**
 * Uploads multiple product images to Firebase Storage.
 * @param productId The ID of the product to associate the images with.
 * @param files The array of image files to upload.
 * @returns A promise that resolves with an array of public URLs of the uploaded images.
 */
export async function uploadProductImages(productId: string, files: File[]): Promise<string[]> {
  const { storage } = initializeFirebase();
  
  const uploadPromises = files.map(async (file, index) => {
    const storageRef = ref(storage, `product-images/${productId}/${Date.now()}-${index}-${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  });

  const downloadURLs = await Promise.all(uploadPromises);
  return downloadURLs;
}

/**
 * Uploads multiple verification documents to Firebase Storage.
 * @param productId The ID of the product to associate the documents with.
 * @param files The array of document files to upload.
 * @returns A promise that resolves with an array of public URLs for the uploaded documents.
 */
export async function uploadVerificationDocuments(productId: string, files: File[]): Promise<string[]> {
  const { storage } = initializeFirebase();

  const uploadPromises = files.map(async (file, index) => {
    const storageRef = ref(storage, `verification-documents/${productId}/${Date.now()}-${index}-${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  });

  const downloadURLs = await Promise.all(uploadPromises);
  return downloadURLs;
}
