import fs from 'fs';
import path from 'path';
import { URL } from 'url';
import client from 'https';
import crypto from 'crypto';

const DIST = path.resolve(process.cwd(), './src/content/notion');
const CACHE_DIST = path.resolve(DIST, '.cache');
// const ImageReg = /(!\[.*\]\(|cover:\s*)([^)\s]*)/g; // 包含封面
const ImageReg = /(!\[.*\]\()([^)\s]*)/g;

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

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    try {
      client.get(new URL(url).href, (res) => {
        if (res.statusCode === 200) {
          res.pipe(fs.createWriteStream(filepath))
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
    } catch {
      console.log('url Error', url);
      resolve(filepath);
    }
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

  p.then(() => {
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