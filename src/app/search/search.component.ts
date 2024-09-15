import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AddedItemsComponent } from '../added-items/added-items.component';
import { FormsModule } from '@angular/forms';
import { Mod } from '../data/mod.model';
import { ModService } from '../data/mod.service';
import { AnimationKeyframesSequenceMetadata } from '@angular/animations';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [AddedItemsComponent, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchCurseForge: string = '';
  searchModrinth: string = '';

  resultsCurseForge: any[] = [];
  resultsModrinth: any[] = [];

  constructor(private http: HttpClient, public modService: ModService) { }

  onSearchCurseForge() {
    const apiUrl = `https://api.curse.tools/v1/cf/mods/search?gameId=432&gameVersions=["1.20.1"]&searchFilter=${this.searchCurseForge}&sortField=2&sortOrder=desc&pageSize=10`;

    this.http.get<any[]>(apiUrl).subscribe(response => {
      this.resultsCurseForge = (<any>response).data;
      console.log(this.resultsCurseForge);
    });
  }

  onSearchModrinth() {
    const apiUrl = `https://api.modrinth.com/v2/search?facets=[["categories:forge"],["versions:1.20.1"],["project_type:mod"]]&query=${this.searchModrinth}`;

    this.http.get<any[]>(apiUrl).subscribe(response => {
      this.resultsModrinth = (<any>response).hits;
      console.log(this.resultsModrinth);
    });
  }

  addCurseForgeMod(slug: string, name: string, id: string, img: string) {
    let mod: Mod = { slug: slug, name: name, description: '', img: img, curseForgeId: id, isClientside: true, isRequired: true, isServerSide: true};
    this.modService.add(mod);

    const apiUrl = `https://api.modrinth.com/v2/project/${slug}`;

    this.http.get<any[]>(apiUrl).subscribe(response => {
      let resultsModrinth = (<any>response);
      
      let mod: Mod = { slug: slug, name: name, description: '', img: img, modrinthId: resultsModrinth.id, isClientside: true, isRequired: true, isServerSide: true};
      this.modService.add(mod);
    });
  }

  addModrinthMod(slug: string, name: string, id: string, img: string) {
    let mod: Mod = { slug: slug, name: name, description: '', img: img, modrinthId: id, isClientside: true, isRequired: true, isServerSide: true};
    this.modService.add(mod);


    const apiUrl = `https://api.curse.tools/v1/cf/mods/search?gameId=432&gameVersions=["1.20.1"]&slug=${slug}&sortField=2&sortOrder=desc`;

    this.http.get<any[]>(apiUrl).subscribe(response => {
      let resultsCurseForge: any[] = (<any>response).data;

      resultsCurseForge.forEach(element => {
        if (element.slug == slug) {
          let mod: Mod = { slug: slug, name: name, description: '', img: img, curseForgeId: element.id, isClientside: true, isRequired: true, isServerSide: true};
          this.modService.add(mod);
        }
      });
    });
  }

  deleteItem(slug: string) {
    this.modService.remove(slug);
  }
}
