// pages/RickAndMorty.tsx
import React from 'react';
import RickCard from '../components/RickCard';

interface Morty {
    id: string;
    name: string;
    origin: { id: string, name: string };
    location: { id: string, name: string };
    image: string;
    // ... other fields
}

interface Rick {
    id: string;
    name: string;
    origin: { id: string, name: string };
    location: { id: string, name: string };
    image: string;
    // ... other fields
}

interface RickAndMortyAssociations {
    rick: Rick;
    morties: Morty[];
}

interface RickAndMortyData {
    rickAndMortyAssociations: RickAndMortyAssociations[];
}

const RickAndMortyPage: React.FC<{ data: RickAndMortyData }> = ({ data }) => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Rick and Morty Data</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.rickAndMortyAssociations?.map((association) => (
                    <RickCard key={association.rick.id} rick={association.rick} />
                    // ... You can also create and use a MortyCard component similarly
                ))}
            </div>
        </div>
    );
};

// This function gets called at build time on server-side.
export async function getEdgeProps() {
    const endpoint = 'http://backend:4000/rickmorty';
    console.log('Attempting to fetch data from:', endpoint);

    try {
        const requestBody = {
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
        };

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await res.json();

        if (!res.ok) {
            console.error('Response not OK:', res.status, res.statusText);
            throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }

        if (data.errors) {
            console.error('GraphQL errors:', data.errors);
            throw new Error('Failed to fetch GraphQL data.');
        }

        console.log('Data fetched successfully:', data.data);
        return { props: { data: data.data } };
    } catch (error) {
        console.error('Error in getEdgeProps:', error);
        return { props: { errors: error instanceof Error ? error.message : 'An error occurred while fetching data' } };
    }
}

export default RickAndMortyPage;
