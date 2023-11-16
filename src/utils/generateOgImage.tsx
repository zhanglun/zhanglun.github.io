import React from 'react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import satori, { SatoriOptions } from "satori";
import { SITE } from "@config";
import fontRegularPath from './NotoSansSC-Regular.otf';
import fontMediumPath from './NotoSansSC-Medium.otf';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("%c Line:8 🌰 __dirname", "color:#ea7e5c", __dirname);

const fetchFonts = async () => {
  // Regular Font
  const fontRegular = fs.readFileSync(path.join(__dirname, '../../', fontRegularPath));

  // const fontRegular: ArrayBuffer = await fontFileRegular.arrayBuffer();

  // Bold Font
  const fontBold = fs.readFileSync(path.join(__dirname, '../../', fontMediumPath));

  return { fontRegular, fontBold };
};

const { fontRegular, fontBold } = await fetchFonts();

const ogImage = (text: string) => {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 64,
        fontWeight: 600,
        color: '#fff',
      }}
    >
      <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 1600 800'><rect fill='#ff9d00' width='1600' height='800' /><g stroke='#000' stroke-width='66.7' stroke-opacity='0.05' ><circle fill='#ff9d00' cx='0' cy='0' r='1800' /><circle fill='#fb8d17' cx='0' cy='0' r='1700' /><circle fill='#f47d24' cx='0' cy='0' r='1600' /><circle fill='#ed6e2d' cx='0' cy='0' r='1500' /><circle fill='#e35f34' cx='0' cy='0' r='1400' /><circle fill='#d85239' cx='0' cy='0' r='1300' /><circle fill='#cc453e' cx='0' cy='0' r='1200' /><circle fill='#be3941' cx='0' cy='0' r='1100' /><circle fill='#b02f43' cx='0' cy='0' r='1000' /><circle fill='#a02644' cx='0' cy='0' r='900' /><circle fill='#901e44' cx='0' cy='0' r='800' /><circle fill='#801843' cx='0' cy='0' r='700' /><circle fill='#6f1341' cx='0' cy='0' r='600' /><circle fill='#5e0f3d' cx='0' cy='0' r='500' /><circle fill='#4e0c38' cx='0' cy='0' r='400' /><circle fill='#3e0933' cx='0' cy='0' r='300' /><circle fill='#2e062c' cx='0' cy='0' r='200' /><circle fill='#210024' cx='0' cy='0' r='100' /></g></svg>
      <div style={{ marginTop: 40, position: 'absolute', fontFamily: "NotoSansSC" }}>{text}</div>
    </div>
  );
};

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  debug: true,
  embedFont: false,
  fonts: [
    {
      name: "NotoSansSC",
      data: fontRegular,
      weight: 400,
      style: "normal",
    },
    {
      name: "NotoSansSC",
      data: fontBold,
      weight: 600,
      style: "normal",
    },
  ],
};

const generateOgImage = async (mytext = SITE.title) =>
  await satori(ogImage(mytext), options);

export default generateOgImage;
