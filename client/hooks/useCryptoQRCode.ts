import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface CryptoWallet {
  cryptoSymbol: string;
  depositAddress: string;
}

export const useCryptoQRCode = (
  user: any,
  cryptos: CryptoWallet[],
  selectedCrypto: string
) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    if (!user) return;

    const currentCrypto = cryptos.find(
      (c) => c.cryptoSymbol === selectedCrypto
    );

    if (!currentCrypto) {
      setQrCodeUrl("");
      return;
    }

    QRCode.toDataURL(currentCrypto.depositAddress, {
      width: 256,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })
      .then(setQrCodeUrl)
      .catch((err) => {
        console.error("QR generation failed:", err);
        setQrCodeUrl("");
      });
  }, [user, cryptos, selectedCrypto]);

  return qrCodeUrl;
};
