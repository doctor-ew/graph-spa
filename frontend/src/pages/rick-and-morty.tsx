import React from 'react';
import { NextPageContext } from 'next';

// Define a more specific type for your data if possible
interface RickAndMortyData {
    rickAndMortyAssociations: {
        rick: Array<{
            id: string;
            name: string;
            // ... other properties
        }>;
        morties: Array<{
            id: string;
            name: string;
            // ... other properties
        }>;
    };
}

interface RickAndMortyProps {
    data?: RickAndMortyData;
    errors?: string;
}

const RickAndMortyPage: React.FC<RickAndMortyProps> = ({ data, errors }) => {
    if (errors) {
        // Log the error to the console for server-side debugging
        console.error('Error rendering page:', errors);
        return <div>Error: {errors}</div>;
    }

    return (
        <div>
            <h1>Rick and Morty Data</h1>
            {data?.rickAndMortyAssociations ? (
                <>
                    <h2>Ricks</h2>
                    {data.rickAndMortyAssociations.rick.map((rick) => (
                        <div key={rick.id}>
                            <p>{rick.name}</p>
                            {/* Add more details as needed */}
                        </div>
                    ))}
                    <h2>Morties</h2>
                    {data.rickAndMortyAssociations.morties.map((morty) => (
                        <div key={morty.id}>
                            <p>{morty.name}</p>
                            {/* Add more details as needed */}
                        </div>
                    ))}
                </>
            ) : (
                <p>No data available.</p>
            )}
        </div>
    );
};

export async function getServerSideProps(context: NextPageContext): Promise<{ props: RickAndMortyProps }> {
    try {
        const res = await fetch('http://backend:4000/rickmorty', {
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
                // ... other fields
              }
              morties {
                id
                name
                // ... other fields
              }
            }
          }
        `,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            const error = `Failed to fetch: ${res.status} ${res.statusText}`;
            console.error('Response not ok:', res, 'Error:', error);
            throw new Error(error);
        }

        if (data.errors) {
            const error = 'Failed to fetch GraphQL data.';
            console.error('GraphQL Errors:', data.errors);
            throw new Error(error);
        }

        return {
            props: { data: data.data },
        };
    } catch (error) {
        // Log the error for server-side debugging
        console.error('Error in getServerSideProps:', error);
        return {
            props: { errors: error instanceof Error ? error.message : 'An error occurred' },
        };
    }
}

export default RickAndMortyPage;
