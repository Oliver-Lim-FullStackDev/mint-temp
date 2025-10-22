export const getTgUserPic = async (userId: string | number) => {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

  if (!BOT_TOKEN) return null;

  const fileId = await getFileId(BOT_TOKEN, userId);
  if (!fileId) {
    return null;
  }

  const fileInfo = await getFile(BOT_TOKEN, fileId);
  const directUrl = getPath(BOT_TOKEN, fileInfo.file_path);

  return directUrl;
};

const TG_API = (token) => `https://api.telegram.org/bot${token}`;

export async function getFileId(botToken, userId, { photoIndex = 0 } = {}) {
  const url = `${TG_API(botToken)}/getUserProfilePhotos?user_id=${userId}&limit=1&offset=${photoIndex}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`getUserProfilePhotos failed: ${res.status} ${res.statusText}`);
  const data = await res.json();
  if (!data.ok) throw new Error(`getUserProfilePhotos error: ${JSON.stringify(data)}`);

  const photos = data.result?.photos;
  if (!Array.isArray(photos) || photos.length === 0) {
    return null;
  }

  // Each "photo" is an array of sizes; pick the last (largest) item
  const sizes = photos[0];
  const best = sizes[sizes.length - 1];
  return best.file_id; // string
}

/**
 * getFile: exchanges a file_id for file info (file_path, size, etc.)
 */
export async function getFile(botToken, fileId) {
  const url = `${TG_API(botToken)}/getFile?file_id=${encodeURIComponent(fileId)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`getFile failed: ${res.status} ${res.statusText}`);
  const data = await res.json();
  if (!data.ok) throw new Error(`getFile error: ${JSON.stringify(data)}`);
  // data.result: { file_id, file_unique_id, file_size?, file_path? }
  return data.result;
}

/**
 * getPath: builds the direct download URL using file_path
 * (You can then download and mirror to your own storage.)
 */
export function getPath(botToken, filePath) {
  if (!filePath) throw new Error('Missing file_path');
  return `https://api.telegram.org/file/bot${botToken}/${filePath}`;
}

/**
 * Convenience: get the user's current avatar direct URL in one call chain
 */
export async function getUserAvatarDownloadUrl(botToken, userId) {
  const fileId = await getFileId(botToken, userId);
  const file = await getFile(botToken, fileId);
  return getPath(botToken, file.file_path);
}
