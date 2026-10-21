/**
 * Client logos
 * ------------
 * Asset disimpan di Sanity (bukan di public/) sesuai AGENTS.md bagian 7.
 * Urutan di sini menentukan urutan tampil pada conveyor di halaman home.
 */
const CDN = "https://cdn.sanity.io/images/pcx1y31m/production";

export type ClientLogo = {
  name: string;
  src: string;
  /** Logo berbentuk kotak/badge, dirender lebih tinggi agar seimbang. */
  square?: boolean;
};

export const clientLogos: ClientLogo[] = [
  { name: "Vidio", src: `${CDN}/184d096022c752dba2f24b2aad060db302981db9-1773x594.png` },
  { name: "Liputan6", src: `${CDN}/2be11dc67e04bc9874b20a5047b1f11e42656db7-1280x244.png` },
  { name: "UPPF Indonesia", src: `${CDN}/3a368b8a379bba876b5d10723a16cacd5e5062ee-1024x266.png` },
  { name: "Edlink", src: `${CDN}/78d8f081a33186fad5a3e593e9e10dbc996f488f-2375x693.png` },
  { name: "Bareksa", src: `${CDN}/2dd6ef1e5ea3891fb41dbe9a9507008830c87697-461x114.png` },
  { name: "Onduline", src: `${CDN}/9234764cde108d276a9e72dbfecf92b1aafe294c-404x114.png` },
  { name: "DjatGo", src: `${CDN}/074d89835e69ccae0f38a6a84f6a6e4b9ab51f8d-812x812.png`, square: true },
  { name: "Rosedale", src: `${CDN}/92271fe17c035a4f37829887c4daba38bf088e6d-1209x1017.png`, square: true },
  { name: "Grand Wisata Bekasi", src: `${CDN}/96ada3ef35208be3d87b71ac08ce475c4f61fcc0-103x152.png`, square: true },
];
