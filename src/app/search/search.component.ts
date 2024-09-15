import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AddedItemsComponent } from '../added-items/added-items.component';
import { FormsModule } from '@angular/forms';
import { Mod } from '../data/mod.model';
import { ModService } from '../data/mod.service';
import { ActivatedRoute } from '@angular/router';

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

  shareableLink: string = '';

  constructor(private http: HttpClient, public modService: ModService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const encodedData = params['data'];
      if (encodedData) {
        this.modService.loadFromShareableLink(encodedData);
      }
    });

    this.generateLink();
  }

  generateLink(): void {
    this.shareableLink = this.modService.generateShareableLink();
    console.log('Generated Shareable Link:', this.shareableLink);
  }

  onSearchCurseForge() {
    const apiUrl = `https://api.curse.tools/v1/cf/mods/search?gameId=432&modLoaderType=${this.modService.getModLoader()}&gameVersions=["${this.modService.getVersion()}"]&searchFilter=${this.searchCurseForge}&sortField=2&sortOrder=desc&pageSize=10`;

    this.http.get<any[]>(apiUrl).subscribe(response => {
      this.resultsCurseForge = (<any>response).data;
      console.log(this.resultsCurseForge);
    });
  }

  onSearchModrinth() {
    const apiUrl = `https://api.modrinth.com/v2/search?facets=[["categories:${this.modService.getModLoader().toLowerCase()}"],["versions:${this.modService.getVersion()}"],["project_type:mod"]]&query=${this.searchModrinth}`;

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


    const apiUrl = `https://api.curse.tools/v1/cf/mods/search?gameId=432&slug=${slug}`;

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
