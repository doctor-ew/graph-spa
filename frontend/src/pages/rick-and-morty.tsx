import React, { useEffect } from 'react';
import { NextPageContext } from 'next';

// Define the types for the data you expect
interface Rick {
    id: string;
    name: string;
    origin: {id:string,name:string};
    location: {id:string,name:string};
    // ... other fields
}

interface Morty {
    id: string;
    name: string;
    origin: {id:string,name:string};
    location: {id:string,name:string};
    // ... other fields
}

interface RickAndMortyAssociations {
    rick: Rick; // Not an array
    morties: Morty[]; // An array of Morty objects
}

interface RickAndMortyData {
    rickAndMortyAssociations: RickAndMortyAssociations[];
}

interface RickAndMortyProps {
    data?: RickAndMortyData;
    errors?: string;
}


// This is the React component that represents the page content
const RickAndMortyPage: React.FC<RickAndMortyProps> = ({ data, errors }) => {
    useEffect(() => {
        console.log('|-D-| data:', data);
        console.log('|-A-| data:', data?.rickAndMortyAssociations);
        // Assign to a window variable for inspection
        if (data) {
            (window as any).myDebugData = data;
        }
    }, [data]); // This will run when `data` changes

    if (errors) {
        return <div>Error: {errors}</div>;
    }


    return (
        <div>
            <h1>Rick and Morty Data</h1>
            {data?.rickAndMortyAssociations?.map((association, index) => (
                <div key={association.rick.id}>
                    <h2>Rick</h2>
                    <p>Name: {association.rick.name}</p>
                    <p>Origin: {association.rick.origin?.name}</p>
                    <p>Location: {association.rick.location?.name}</p>
                    <h2>Associated Morties</h2>
                    {association.morties.map((morty) => (
                        <div key={morty.id}>
                            <p>Name: {morty.name}</p>
                            <p>Origin: {morty.origin?.name}</p>
                            <p>Location: {morty.location?.name}</p>
                        </div>
                    ))}
                </div>

            ))}
        </div>
    );
};



// This function runs on the server and gets the data for the page
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
                status
                species
                type
                gender
                image
                episode {
                  id
                  name
                }
              }
              morties {
                id
                name
                status
                species
                type
                gender
                image
                episode {
                  id
                  name
                }
              }
            }
          }
        `,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            console.error('Response not ok:', res);
            console.error('Response details:', data); // Log the response body for more details
            throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }

        if (data.errors) {
            console.error('GraphQL Errors:', data.errors);
            throw new Error('Failed to fetch GraphQL data.');
        }

        return {
            props: { data: data.data },
        };
    } catch (error) {
        console.error('Error in getServerSideProps:', error);
        return {
            props: { errors: error instanceof Error ? error.message : 'An error occurred' },
        };
    }
}

export default RickAndMortyPage;
