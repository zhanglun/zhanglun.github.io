const fs = require('fs');
const path = require('path');
const client = require('https');
const crypto = require('crypto');

const DIST = path.resolve(process.cwd(), './content/notion');
const CACHE_DIST = path.resolve(DIST, '.cache');
const ImageReg = /!\[.*\]\((.*)\)/g;

const getImageURLs = (content) => {
  const reg = new RegExp(ImageReg);
  const imageList = [];

  let result = reg.exec(content);

  while (result !== null) {
    imageList.push(result[1]);
    result = reg.exec(content);
  }

  return imageList;
};

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    client.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
          .on('error', reject)
          .once('close', () => resolve(filepath));
      } else {
        // Consume response data to free up memory
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    });
  });
}

const createPost = (title, content) => {
  const folder = path.join(DIST, title);
  const imageFolder = path.join(folder, 'images');

  if (!fs.existsSync(CACHE_DIST)) {
    fs.mkdirSync(CACHE_DIST);
  }

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }

  if (!fs.existsSync(imageFolder)) {
    fs.mkdirSync(imageFolder);
  }

  const imageURLs = getImageURLs(content);
  const localFileList = [];
  let p = Promise.resolve();

  imageURLs.forEach((url, idx) => {
    const ext = path.extname(url).replace(/\?.*/ig, '');
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

        content = content.replace(href, relativePath);
      }
    });

    fs.writeFileSync(path.resolve(folder, 'index.md'), content);
  });
};

exports.createPost = createPost;
