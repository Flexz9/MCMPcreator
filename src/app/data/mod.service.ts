import { Injectable } from '@angular/core';
import { Mod } from './mod.model';

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

    this.modLoader = savedModLoader || 'neoForge';
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

  setVersion(version: string) {
    this.version = version;
    localStorage.setItem('version', this.version);
  }

  setModLoader(modLoader: string) {
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
}