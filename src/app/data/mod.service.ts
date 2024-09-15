import { Injectable } from '@angular/core';
import { Mod } from './mod.model';
import * as pako from 'pako';
import { encode as base64Encode, decode as base64Decode } from 'base64-arraybuffer';

@Injectable({
  providedIn: 'root',
})
export class ModService {
  private modLoader: string;
  private version: string;
  private modList: Mod[] = [];

  constructor() {
    const savedModLoader = localStorage.getItem('modLoader');
    const savedVersion = localStorage.getItem('version');
    const savedModList = localStorage.getItem('modList');

    this.modLoader = savedModLoader || 'Forge';
    this.version = savedVersion || '1.20.1';

    if (savedModList) {
      try {
        this.modList = JSON.parse(savedModList);
      } catch (e) {
        console.error('Error parsing mod list from localStorage', e);
        this.modList = [];
      }
    }
  }

  getmodList(): Mod[] {
    return this.modList;
  }

  modExists(slug: string): Mod | null {
    return this.modList.find(obj => obj.slug.toLowerCase() === slug.toLowerCase()) || null;
  }

  add(mod: Mod): void {
    let modExists = this.modExists(mod.slug);
    if (modExists) {
      if (mod.curseForgeId) {
        modExists.curseForgeId = mod.curseForgeId;
      }
      if (mod.modrinthId) {
        modExists.modrinthId = mod.modrinthId;
      }
    } else {
      this.modList.push(mod);
    }

    console.log(this.modList);
    this.saveModList();
  }

  remove(slug: string): void {
    this.modList = this.modList.filter(mod => mod.slug !== slug);
    this.saveModList();
  }

  setVersion(version: string): void {
    this.version = version;
    localStorage.setItem('version', this.version);
  }

  setModLoader(modLoader: string): void {
    this.modLoader = modLoader;
    localStorage.setItem('modLoader', this.modLoader);
  }

  getVersion(): string {
    return this.version;
  }

  getModLoader(): string {
    return this.modLoader;
  }

  private saveModList(): void {
    localStorage.setItem('modList', JSON.stringify(this.modList));
  }

  generateShareableLink(): string {
    const data = {
      modLoader: this.modLoader,
      version: this.version,
      modList: this.modList,
    };

    try {
      const jsonData = JSON.stringify(data);
      const compressedData = pako.deflate(jsonData);
      const encodedData = this.base64UrlEncode(compressedData);

      const shareableUrl = `${window.location.origin}/?data=${encodedData}`;

      return shareableUrl;
    } catch (error) {
      console.error('Error generating shareable link:', error);
      return '';
    }
  }

  loadFromShareableLink(encodedData: string): void {
    try {
      const compressedData = this.base64UrlDecode(encodedData);
      const jsonData = pako.inflate(compressedData, { to: 'string' });
      const data = JSON.parse(jsonData);

      this.modLoader = data.modLoader || 'Forge';
      this.version = data.version || '1.20.1';
      this.modList = data.modList || [];

      localStorage.setItem('modLoader', this.modLoader);
      localStorage.setItem('version', this.version);
      localStorage.setItem('modList', JSON.stringify(this.modList));
    } catch (error) {
      console.error('Failed to load data from shareable link:', error);
    }
  }

  private base64UrlEncode(data: ArrayBuffer): string {
    return base64Encode(data)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  private base64UrlDecode(base64UrlString: string): ArrayBuffer {
    let base64 = base64UrlString
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    const pad = base64.length % 4;
    if (pad) {
      base64 += '===='.slice(0, 4 - pad);
    }

    return base64Decode(base64);
  }
}
