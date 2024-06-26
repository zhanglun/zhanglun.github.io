import React from "react";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import satori, { SatoriOptions } from "satori";
import { SITE } from "@config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log("%c Line:11 🍡 import.meta.url", "color:#93c0a4", import.meta.url);

console.log("%c Line:8 🌰 __dirname", "color:#ea7e5c", __dirname);

const fetchFonts = async () => {
  const fontFileRegular = await fetch(
    "https://raw.githubusercontent.com/zhanglun/zhanglun.github.io/master/public/assets/NotoSansSC-Regular.otf"
  );
  const fontRegular: ArrayBuffer = await fontFileRegular.arrayBuffer();

  // Bold Font
  const fontFileBold = await fetch(
    "https://raw.githubusercontent.com/zhanglun/zhanglun.github.io/master/public/assets/NotoSansSC-Medium.otf"
  );
  const fontBold: ArrayBuffer = await fontFileBold.arrayBuffer();

  return { fontRegular, fontBold };
};

const { fontRegular, fontBold } = await fetchFonts();

const ogImage = (text: string) => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        fontSize: 32,
        fontWeight: 600,
      }}
    >
      <img
        src="https://raw.githubusercontent.com/zhanglun/zhanglun.github.io/master/public/assets/PyCharm_1920x1920.svg"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
      ></div>
      <div
        style={{
          color: "#fff",
          fontSize: "50px",
          textAlign: "center",
          backgroundColor: "rgba(0,0,0,0.77)",
          padding: "24px 30px",
          borderRadius: "40px",
          maxWidth: "80%",
        }}
      >
        {text}
      </div>
      <div
        style={{
          display: "flex",
          padding: "40px",
        }}
      >
        <img
          src="https://raw.githubusercontent.com/zhanglun/zhanglun.github.io/master/public/assets/icon.png"
          style={{ width: "66px", height: "66px", borderRadius: "50%" }}
        />
      </div>
    </div>
  );
};

const options: SatoriOptions = {
  width: 1200,
  height: 630,
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
