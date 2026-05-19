import fs from 'fs';
import path from 'path';
import { URL } from 'url';
import client from 'https';
import crypto from 'crypto';

const DIST = path.resolve(process.cwd(), './src/content/notion');
const CACHE_DIST = path.resolve(DIST, '.cache');
// const ImageReg = /(!\[.*\]\(|cover:\s*)([^)\s]*)/g; // 包含封面
const ImageReg = /(!\[.*\]\()([^)\s]*)/g;
const DOWNLOAD_RETRY_LIMIT = 3;

const getImageURLs = (content) => {
  const reg = new RegExp(ImageReg);
  const imageList = [];

  let result = reg.exec(content);

  while (result !== null) {
    imageList.push(result[2]);
    result = reg.exec(content);
  }

  return imageList;
};

const wait = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

function downloadImage(url, filepath, attempt = 1) {
  return new Promise((resolve, reject) => {
    try {
      const request = client.get(new URL(url).href, (res) => {
        if (res.statusCode === 200) {
          res
            .on('error', reject)
            .pipe(fs.createWriteStream(filepath))
            .on('error', reject)
            .once('close', () => {
              console.log(`Download ${url} to ${filepath}`);
              resolve(filepath);
            });
        } else {
          // Consume response data to free up memory
          res.resume();
          console.log("filepath", filepath);
          reject(new Error(`Request Failed With a Status Code: ${res.statusCode}, URL: ${url}`));
        }
      });
      request.setTimeout(30000, () => {
        request.destroy(new Error(`Request timed out: ${url}`));
      });
      request.on('error', reject);
    } catch {
      console.log('url Error', url);
      resolve(filepath);
    }
  }).catch(async (error) => {
    if (attempt >= DOWNLOAD_RETRY_LIMIT) {
      throw error;
    }

    console.warn(
      `Retry download ${url} (${attempt + 1}/${DOWNLOAD_RETRY_LIMIT}): ${error.message}`
    );
    await wait(500 * attempt);

    return downloadImage(url, filepath, attempt + 1);
  });
}

export const createPost = (title, content) => {
  const folder = path.join(DIST, title);
  const imageFolder = path.join(folder, 'images');

  if (!fs.existsSync(DIST)) {
    fs.mkdirSync(DIST);
  }

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }

  if (!fs.existsSync(CACHE_DIST)) {
    fs.mkdirSync(CACHE_DIST);
  }

  if (!fs.existsSync(imageFolder)) {
    fs.mkdirSync(imageFolder);
  }

  // remove ``` blocks
  const imageURLs = getImageURLs(content.replace(/```[a-z]*\n[\s\S]*?\n```/ig, ''));
  const localFileList = [];
  let p = Promise.resolve();

  imageURLs.forEach((url, idx) => {
    const ext = path.extname(url.replace(/\?.*/ig, '')) || '.jpg';
    const filename = `${crypto.randomBytes(8).toString('hex')}${ext}`;

    p = p.then(() => downloadImage(url, path.join(imageFolder, filename))).then(() => {
      localFileList[idx] = filename;
    });
  });

  return p.then(() => {
    imageURLs.forEach((url, idx) => {
      if (localFileList[idx]) {
        const href = url.split('?')[0];
        const relativePath = path.relative(folder, path.join(imageFolder, localFileList[idx]));

        content = content.replace(url, `./${relativePath}`);
      }
    });

    fs.writeFileSync(path.resolve(folder, 'index.md'), content);
  });
};
