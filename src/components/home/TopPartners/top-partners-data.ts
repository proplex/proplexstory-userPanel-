interface Partner {
    name: string;
    thumbnail: string;
    noOfProjects: number;
}

export const TopPartners: Partner[] = [
    {
        name: "Marvel Studios",
        thumbnail: "/marvel-studios.png",
        noOfProjects: 30
    },
    {
        name: "DC",
        thumbnail: "/dc.png",
        noOfProjects: 350
    },
    {
        name: "Star Wars",
        thumbnail: "/star-wars.png",
        noOfProjects: 100
    },
    {
        name: "Star Treks",
        thumbnail: "/star-trek.png",
        noOfProjects: 150
    },
]