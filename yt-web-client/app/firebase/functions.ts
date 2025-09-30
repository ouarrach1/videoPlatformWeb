import {httpsCallable } from 'firebase/functions';
import { functions } from './firebase';


const generateUploadUrlFunction = httpsCallable(functions, 'generateUploadUrl');
const getVideosFunction = httpsCallable(functions, 'getVideos');

export async function uploadVideo(file: File) {
  const response = await generateUploadUrlFunction({
    fileExtension: file.name.split('.').pop() || ''
  }) as { data: { url: string; fileName: string } };
  
   await fetch(response?.data?.url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  return ;
}

export interface Video {
    id?: string,
    uid?: string,
    filename?: string,
    status?: 'processing' | 'processed',
    title?: string,
    description?: string  
}
  
export async function getVideos() {
    const response = await getVideosFunction() as { data: Video[] };
    return response.data as Video[];
}
