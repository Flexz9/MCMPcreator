export interface Mod {
    slug: string;
    name: string;
    description: string;
    img?: string;

    curseForgeId?: string;
    modrinthId?: string;

    isClientside: boolean;
    isRequired: boolean;
    isServerSide: boolean;
}