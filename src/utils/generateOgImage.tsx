import React from "react";
import fs from "fs";
import path from "path";
import satori from "satori";
import { SITE } from "@config";
import type { SatoriOptions } from "satori";

const publicAssets = path.resolve(process.cwd(), "public/assets");

const readAsset = (filename: string) =>
  fs.readFileSync(path.join(publicAssets, filename));

const readFont = (filename: string) => {
  const font = readAsset(filename);
  return font.buffer.slice(font.byteOffset, font.byteOffset + font.byteLength);
};

const toDataUri = (filename: string, mimeType: string) =>
  `data:${mimeType};base64,${readAsset(filename).toString("base64")}`;

const fontRegular = readFont("NotoSansSC-Regular.otf");
const fontBold = readFont("NotoSansSC-Medium.otf");
const coverImage = toDataUri("PyCharm_1920x1920.svg", "image/svg+xml");
const avatarImage = toDataUri("icon.png", "image/png");

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
        src={coverImage}
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
          src={avatarImage}
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
