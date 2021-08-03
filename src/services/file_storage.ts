import { RcFile } from 'antd/lib/upload';
// import { getFirebaseStorage } from '../../utils/firebaseStorage';
import path from 'path';
import { UploadFile } from 'antd/lib/upload/interface';
import { getFirebaseStorage } from '../utils/firebaseStorage';

export async function uploadFiles(files: UploadFile[], dirPath: string) {
  const storage = getFirebaseStorage();
  if (!storage) {
    alert('storage setup fail');
    return;
  }

  for (const file of files) {
    const imagePath = path.join(dirPath, file.name);

    const imagesRef = storage.ref(imagePath);

    await imagesRef.put(file.originFileObj);
  }
}

export function getBase64(file: UploadFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file.originFileObj);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export async function getFiles(dirPath: string) {
  const storage = getFirebaseStorage();
  if (!storage) {
    alert('storage setup fail');
    return;
  }

  const dirRef = storage.ref(dirPath);

  const listFiles = await dirRef.listAll();

  // console.log(listFiles.items, listFiles);
  return listFiles;
}
