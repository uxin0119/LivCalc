import CryptoJS from "crypto-js";
import LZString from "lz-string";

type SerializableData = string | number | boolean | null | SerializableArray | SerializableObject;
type SerializableArray = SerializableData[];
type SerializableObject = { [key: string]: SerializableData };

class Util {
    private static readonly SECRET_KEY: string = 'not-secret';

    /**
     * AES암호화
     * @param data
     */
    static encrypt(data: SerializableData): string {
        const jsonString = JSON.stringify(data);

        return CryptoJS.AES.encrypt(jsonString, this.SECRET_KEY).toString();
    }

    /**
     * AES복호화
     * @param data
     */
    static decrypt<T extends SerializableData>(data: string): T {
        const bytes = CryptoJS.AES.decrypt(data, this.SECRET_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }

    /**
     * 로컬 스토리지에 저장(압축해서)
     * @param name
     * @param data
     */
    static saveLocalStorage(name: string, data: SerializableData): void {
        localStorage.setItem(name, this.compressForStorage(data));
    }

    /**
     * 로컬스토리지에서 가져오기(압축된 데이터)
     * @param name
     */
    static loadLocalStorage<T extends SerializableData>(name: string): T{
        const encryptedData:string | null = localStorage.getItem(name);
        if (encryptedData === null) {
            return null as unknown as T;
        }

        return this.decompressFromStorage(encryptedData);
    }

    /**
     * 일반 압축 (UTF16 인코딩)
     * @param data
     */
    static compressForStorage(data: SerializableData): string {
        const jsonString = JSON.stringify(data);
        return LZString.compressToUTF16(jsonString);
    }

    /**
     * 일반 압축해제
     * @param compressed
     */
    static decompressFromStorage<T extends SerializableData>(compressed: string): T {
        const decompressed = LZString.decompressFromUTF16(compressed);
        return decompressed ? JSON.parse(decompressed) : null as unknown as T;
    }

    /**
     * Base64 압축 (더 안전한 저장)
     * @param data
     */
    static compressToBase64(data: SerializableData): string {
        const jsonString = JSON.stringify(data);
        return LZString.compressToBase64(jsonString);
    }

    /**
     * Base64 압축해제 (더 안전한 저장)
     * @param compressed
     */
    static decompressFromBase64<T extends SerializableData>(compressed: string): T {
        const decompressed = LZString.decompressFromBase64(compressed);
        return decompressed ? JSON.parse(decompressed) : null as unknown as T;
    }

}

export default Util;