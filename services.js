// ==========================================================================
// SoCialBr — Motores Criptográficos e de Armazenamento Integrados
// ==========================================================================

const CryptoService = {
  async importKeyFromHex(hexStr) {
    const cleanHex = hexStr.replace(/\s/g, '');
    const bytes = new Uint8Array(cleanHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    return await window.crypto.subtle.importKey("raw", bytes, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
  },

  async encryptData(textData, hexKey) {
    const key = await this.importKeyFromHex(hexKey);
    const encoded = new TextEncoder().encode(textData);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, encoded);
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), iv.length);
    return btoa(String.fromCharCode(...combined));
  },

  async decryptData(base64Cipher, hexKey) {
    try {
      const key = await this.importKeyFromHex(hexKey);
      const bin = atob(base64Cipher);
      const combined = new Uint8Array(bin.length).map((_, i) => bin.charCodeAt(i));
      const iv = combined.slice(0, 12);
      const ciphertext = combined.slice(12);
      const decrypted = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, ciphertext);
      return new TextDecoder().decode(decrypted);
    } catch (e) { return null; }
  }
};

const StorageService = {
  save(key, val) { localStorage.setItem(`socialbr_${key}`, JSON.stringify(val)); },
  load(key) { const d = localStorage.getItem(`socialbr_${key}`); return d ? JSON.parse(d) : null; },
  clearAll() { Object.keys(localStorage).filter(k => k.startsWith('socialbr_')).forEach(k => localStorage.removeItem(k)); },
  
  async uploadMediaToDrive(fileName, payload, token) {
    try {
      const metadata = { name: fileName, mimeType: 'application/json', parents: ['appDataFolder'] };
      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      formData.append('file', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
      const res = await fetch('https://googleapis.com', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const r = await res.json();
      return r.id;
    } catch (e) { return null; }
  }
};
