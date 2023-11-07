// /app/RickAndMorty/page.tsx

import React from 'react';

// Define the types for the data you expect
export interface Origin {
    id: string;
    name: string;
}

export interface Character {
    id: string;
    name: string;
    origin: Origin;
    location: Origin;
    image: string;
}

export interface RickAndMortyAssociations {
    rick: Character; // Not an array
    morties: Character[]; // An array of Morty objects
}

export interface RickAndMortyProps {
    rickAndMortyAssociations: RickAndMortyAssociations[];
    errors?: string;
}

// This is the server component that represents the page content
export default async function RickAndMortyPage() {
    console.log('|-o-| Loaded RickAndMorty page.tsx');
    try {
        const response = await fetch('http://backend:4000/rickmorty', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    {
                        rickAndMortyAssociations {
                            rick {
                                id
                                name
                                origin {
                                    id
                                    name
                                }
                                location {
                                    id
                                    name
                                }
                                image
                            }
                            morties {
                                id
                                name
                                origin {
                                    id
                                    name
                                }
                                location {
                                    id
                                    name
                                }
                                image
                            }
                        }
                    }
                `,
            }),
        });

        const json = await response.json();

        if (!response.ok) {
            console.log('|-E-| response: ',response);
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        if (json.errors) {
            console.log('|-E-| json.errors: ',json.errors);
            throw new Error('Failed to fetch GraphQL data.');
        }

        console.log('|-RAMA-| json.data.rickAndMortyAssociations: ',json.data.rickAndMortyAssociations);
        // If the data is fetched successfully, return it inside the props object
        return {
            props: {
                rickAndMortyAssociations: json.data.rickAndMortyAssociations
            }
        };

    } catch (error) {
        // If there's an error, return it inside the props object
        return {
            props: {
                rickAndMortyAssociations: [],
                errors: error instanceof Error ? error.message : 'An error occurred'
            }
        };
    }
}
